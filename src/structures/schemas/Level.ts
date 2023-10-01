import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqBool } from '@constants/schemas';
import type { ILevel } from '@typings/schemas';

export default model<ILevel>(
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
