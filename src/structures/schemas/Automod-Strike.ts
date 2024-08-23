import { Schema, model } from 'mongoose';
import { reqString } from '@constants/schemas';
import type { IAutomodStrike } from '@typings/schemas';

export default model<IAutomodStrike>(
  'Automod-Strike',
  new Schema({
    guildId: reqString,
    userId: reqString,
    date: reqString,
    type: reqString,
  }),
);
