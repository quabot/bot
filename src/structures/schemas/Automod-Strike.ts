import { Schema, model } from 'mongoose';
import { reqNum, reqString } from '@constants/schemas';
import type { IAutomodStrike } from '@typings/schemas';

export default model<IAutomodStrike>(
  'Automod-Strike',
  new Schema({
    guildId: reqString,
    userId: reqString,
    date: reqNum,
    type: reqString,
  }),
);
