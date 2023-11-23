import { Schema, model } from 'mongoose';
import { reqString, reqArray, reqNum, optString } from '@constants/schemas';
import type { IPoll } from '@typings/schemas';

export default model<IPoll>(
  'Poll',
  new Schema({
    guildId: reqString,
    id: reqNum,
    channel: reqString,
    message: reqString,
    interaction: reqString,
    role: optString,

    topic: reqString,
    description: reqString,

    duration: reqString,
    optionsCount: reqNum,
    options: reqArray,

    created: reqString,
    endTimestamp: reqString,
  }),
);
