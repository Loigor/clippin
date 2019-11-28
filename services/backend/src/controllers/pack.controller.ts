import { Request, Response } from 'express'
import Knex from '../utils/knex';
import * as schema from '../models/schema'
import * as structure from '../models/structure'
import axios from 'axios';
import * as _ from 'lodash';
const { Storage } = require('@google-cloud/storage');

const getPackSamples = async (packId: number) => {
  try {
    const samples = (await Knex.raw(`
      SELECT sample.* 
      FROM sample 
      INNER JOIN pack_has_sample ss 
        ON ss.sample_id = sample.id
      WHERE ss.pack_id = ?  
      `, packId)).rows as structure.Sample[];

    return samples;
  } catch (error) {
    throw error;
  }
}



/**
 * 
 * @param req GET /api/v1/packs
 * @param res packs[]
 */
export const getPacks = async (req: Request, res: Response) => {
  try {
    const query = Knex('pack').select('*');

    if (req.params.id) query.where('id', '=', req.params.id);

    const data = await query as schema.pack[] as structure.Pack[];
    if (data === null || data === undefined) return res.send([]); //reply([]).code(404);

    for (const pack of data) {
      pack.samples = await getPackSamples(pack.id);
    }

    return res.send(data);
  } catch (err) {
    return res.send(err)

  }
}

/**
 * 
 * @param req POST /api/v1/packs
 * @param res pack
 */
export const createPack = async (req: Request, res: Response) => {
  const { body } = req;

  if (body) {
    const { id } = body;
    const packData = _.pickBy(body, (val, key) => val && (key in structure.object.PACK))
    try {
      if (Number(id)) {
        const updatedPack = (await Knex('pack').update(packData, '*').where({ id: Number(id) }))[0];
        return res.send(updatedPack);
      } else {
        const newPack = (await Knex('pack').insert(packData).returning('*'))[0];
        return res.send(newPack);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  } else {
    return res.status(500).send('No body')
  }

}
