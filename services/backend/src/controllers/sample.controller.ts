import { Request, Response } from 'express'
import Knex from '../utils/knex';
import * as schema from '../models/schema'
import * as structure from '../models/structure'
import axios from 'axios';
import * as _ from 'lodash';
import { getSampleFileInfo } from '../utils/sampleUtils';
const { Storage } = require('@google-cloud/storage');

interface GetSampleParams {
    ids?: number[],
    tags?: boolean,
}

const getStorageUrl = async (sample: schema.sample): Promise<string> => {
    const filename = _.get(sample, 'metadata.file.filename');

    const gstorage = new Storage({
        projectId: 'fiery-spider-137823',
        keyFile: '/usr/src/app/src/gcloud-credentials.json'
    });

    const bucket = gstorage.bucket('clippin');

    const gfile = bucket.file(filename);
    const url = await new Promise((resolve, reject) => {
        gfile.getSignedUrl({
            action: 'read',
            expires: '03-17-2025'

        }, (err: any, url: string) => {
            if (err) {
                console.error(err);
                reject('gstorage err')
            }
            //const parsed = '/files/' + (url.split('/').slice(3).join('/'))
            resolve(url);
        })
    })


    return url as string;
}

const getFileLocation = async (sample: structure.Sample) => {
    const filename = _.get(sample, 'metadata.file.filename');
    const waveform = _.get(sample, 'metadata.analysis.waveform');
    const gstorage = new Storage({
        projectId: 'fiery-spider-137823',
        keyFile: '/usr/src/app/src/gcloud-credentials.json',
        bucket: 'clippin'
    });

    const gfile = gstorage.bucket().file(filename);
    const gurl = await gfile.getSignedUrl({
        action: 'read',
    })
    return {
        ...sample,
        file_uri: gurl[0],//filename ? '/api/v1/files/uploads/' + filename : undefined,
        waveform: waveform ? '/api/v1/files/exports/' + waveform.split('/').pop() : undefined
    }
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

export const getSamplesLocal = async (params: GetSampleParams): Promise<structure.Sample[]> => {
    try {
        const query = Knex('sample').select('*');

        if (params.ids) query.whereIn('id', params.ids);

        const data = await query as schema.sample[] as structure.Sample[];
        if (data === null || data === undefined) return []; //reply([]).code(404);
        const samples = data.map(sample => {
            const filename = _.get(sample, 'metadata.file.filename');
            const waveform = _.get(sample, 'metadata.analysis.waveform');
            return {
                ...sample,
                file_uri: filename ? '/api/v1/files/uploads/' + filename : undefined,
                waveform: waveform ? '/api/v1/files/exports/' + waveform.split('/').pop() : undefined
            }
        })

        for (const sample of samples) {
            sample.tags = await getSampleTags(sample.id);
        }

        return samples;
    } catch (error) {
        throw error

    }
}

const getSampleTags = async (sampleId: number) => {
    const tags = (await Knex.raw(`
        SELECT tag.* FROM tag 
        INNER JOIN sample_has_tag st ON st.tag_id = tag.id
        WHERE st.sample_id = ?
    `, sampleId)).rows;

    return tags;
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

        const data = await query as schema.sample[] as structure.Sample[];
        if (data === null || data === undefined) return res.send([]); //reply([]).code(404);
        // const samples = data.map(sample => getFileLocation(sample))
        //const samples = await Promise.all(data.map(async sample => await getFileLocation(sample)))
        const samples = data;
        for (const sample of data) {
            sample.tags = await getSampleTags(sample.id);
            sample.file_uri = await getStorageUrl(sample);
        }
        return res.send(data);
    } catch (error) {
        return res.send(error)

    }
}

/**
 * 
 * @param req GET /api/v1/packs/:id/samples
 * @param res samples[]
 */
export const getSamplesByPack = async (req: Request, res: Response) => {
    try {
        const samples = await Knex('sample')
            .select('sample.*')
            .innerJoin('pack_has_sample', 'sample_id', 'sample.id')
            .where('pack_has_sample.pack_id', req.params.id)
        for (const sample of samples) {
            sample.file_uri = await getStorageUrl(sample)
        }
        return res.send(samples);
    } catch (error) {
        return res.send(error)
    }
}

/**
 * 
 * @param req POST /api/v1/samples
 * @param res sample
 */
export const createSample = async (req: Request, res: Response) => {
    req.setTimeout(1000 * 10 * 2);
    const { body, file } = req;
    if (!body || !file) return res.status(500).send('No body');

    try {

        const gstorage = new Storage({
            projectId: 'fiery-spider-137823',
            keyFile: '/usr/src/app/src/gcloud-credentials.json'
        });

        const newSample = (await Knex('sample').insert({
            filename: file.originalname,
            metadata: { file },
            bpm: body.bpm
        }).returning('*'))[0] as schema.sample;
        console.log("new sample: ", newSample)

        if (Number(body.packId)) {
            await Knex('pack_has_sample').insert({
                pack_id: Number(body.packId),
                sample_id: newSample.id
            })
        }

        //res.send({ ...newSample, analyzing: true });
        /*const analysis = (await axios({ method: 'post', url: 'http://analyzer:8080/analyze', data: newSample.metadata })).data
        const metadata = { ...newSample.metadata, analysis };
        console.log("Analysis: ", analysis)
        if (analysis) {
            await Knex('sample').update({ bpm: analysis.tempo, metadata }).where('id', newSample.id).returning('*');
        }*/

        const analysedSample = await analyzeSample(newSample) as structure.Sample;

        try {

            // await gstorage.bucket('clippin').upload(file.path, (error, file, res) => {
            //     console.log(error)
            //     console.log("Res: ", res);
            // });

            const gret = await gstorage.bucket('clippin').upload(file.path, {
                gzip: true,
                metadata: {
                    // Enable long-lived HTTP caching headers
                    // Use only if the contents of the file will never change
                    // (If the contents will change, use cacheControl: 'no-cache')
                    cacheControl: 'public, max-age=31536000',
                },
            })

            console.log("G Storage: ", gret);

        } catch (error) {
            console.error("G Storage error: ", error)
            throw error;
        }

        analysedSample.file_uri = await getStorageUrl(analysedSample);

        res.send(
            analysedSample
        )

    } catch (error) {
        return res.status(500).send(error);
    }
}
