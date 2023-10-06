import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqBool } from '@constants/schemas';

export default model(
  'User',
  new Schema({
    guildId: reqString,
    userId: reqString,

    bans: reqNum,
    tempbans: reqNum,
    warns: reqNum,
    kicks: reqNum,
    timeouts: reqNum,

    afk: reqBool,
    afkMessage: reqString,
  }),
);
