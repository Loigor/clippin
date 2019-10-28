import { Request, Response } from 'express'
import Knex from '../utils/knex';
import * as schema from '../models/schema'
import axios from 'axios';
import * as _ from 'lodash';
//const knex = Knex();

const getPublicPaths = (uploadFile: string, exportFile: string) => {
    const rootUri = '';
    return ({
        file_uri: rootUri + '/api/v1/files/uploads/' + uploadFile,
        waveform: rootUri + '/api/v1/files/exports/' + exportFile
    })
}

export const analyzeSample = async (sample: schema.sample): Promise<schema.sample> => {
    const analysis = (await axios({ method: 'post', url: 'http://analyzer:8080/analyze', data: sample.metadata })).data
    const metadata = { ...sample.metadata, analysis };
    console.log("Analysis: ", analysis)
    if (analysis) {
        await Knex('sample').update({ bpm: analysis.tempo, metadata, md5: metadata.analysis.md5 }).where('id', sample.id).returning('*');
    }

    return { ...sample, metadata }
}

/**
 * 
 * @param req GET /api/v1/samples
 * @param res samples[]
 */
export const getSamples = async (req: Request, res: Response) => {
    try {
        const query = Knex('sample').select('*');

        if (req.params.id) query.where('id', '=', req.params.id);

        const data = await query as schema.sample[]
        if (data === null || data === undefined) return res.send([]); //reply([]).code(404);
        const samples = data.map(sample => {
            const filename = _.get(sample, 'metadata.file.filename');
            const waveform = _.get(sample, 'metadata.analysis.waveform');
            return {
                ...sample,
                file_uri: filename ? '/api/v1/files/uploads/' + filename : undefined,
                waveform: waveform ? '/api/v1/files/exports/' + waveform.split('/').pop() : undefined
            }
        })

        return res.send(samples);
    } catch (err) {
        return res.send(err)

    }
}

/**
 * 
 * @param req POST /api/v1/samples
 * @param res sample
 */
export const createSample = async (req: Request, res: Response) => {
    req.setTimeout(1000 * 60 * 2);
    try {
        const { body, file } = req;
        console.log("STUFF: ", req.body)
        console.log("File: ", req.file)
        if (body && file) {
            const newSample = (await Knex('sample').insert({
                filename: file.originalname,
                metadata: { file },
                bpm: req.body.bpm
            }).returning('*'))[0] as schema.sample;

            console.log("new sample: ", newSample)


            //res.send({ ...newSample, analyzing: true });
            /*const analysis = (await axios({ method: 'post', url: 'http://analyzer:8080/analyze', data: newSample.metadata })).data
            const metadata = { ...newSample.metadata, analysis };
            console.log("Analysis: ", analysis)
            if (analysis) {
                await Knex('sample').update({ bpm: analysis.tempo, metadata }).where('id', newSample.id).returning('*');
            }*/

            const analysedSample = await analyzeSample(newSample);


            res.send({
                ...analysedSample,
                //...getPublicPaths(file.filename, _.get(analysedSample.metadata, 'waveform').split('/').pop()),
            })
        } else {
            return res.send('err')
        }
    } catch (err) {
        return res.status(500).send(err);
    }
}
