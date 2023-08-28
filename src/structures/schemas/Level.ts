import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqBool } from '@constants/schemas';

export default model(
  'Level',
  new Schema({
    guildId: reqString,
    userId: reqString,
    xp: reqNum,
    level: reqNum,
    role: reqString,
    active: reqBool,
  }),
);
