import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IPunishment } from '@typings/schemas';

export default model<IPunishment>(
  'Report',
  new Schema({
    guildId: reqString,
    userId: reqString,

    channelId: reqString,
    moderatorId: reqString,
    time: reqString,

    type: reqString,
    id: reqString,
    reason: reqString,
    duration: reqString,
    active: reqBool,
  }),
);
