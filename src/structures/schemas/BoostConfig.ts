import { reqBool, reqObject, reqString } from '@constants/schemas';
import { IBoostConfig } from '@typings/schemas';
import { Schema, model } from 'mongoose';

export default model<IBoostConfig>(
  'Boost-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    channel: reqString,
    message: reqObject,
    type: reqString,
  }),
);
