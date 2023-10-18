import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqNum } from '@constants/schemas';
import type { IGiveaway } from '@typings/schemas';

export default model<IGiveaway>(
  'Giveaway',
  new Schema({
    guildId: reqString,
    id: reqNum,

    prize: reqString,
    winners: reqNum,

    channel: reqString,
    message: reqString,
    host: reqString,

    endTimestamp: reqString,
    ended: reqBool,
  }),
);
