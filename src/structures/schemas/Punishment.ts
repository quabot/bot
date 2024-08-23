import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqNum } from '@constants/schemas';
import type { IPunishment } from '@typings/schemas';

export default model<IPunishment>(
  'Punishment',
  new Schema({
    guildId: reqString,
    userId: reqString,

    channelId: reqString,
    moderatorId: reqString,
    time: reqNum,

    type: reqString,
    id: reqString,
    reason: reqString,
    duration: reqString,
    active: reqBool,
  }),
);
