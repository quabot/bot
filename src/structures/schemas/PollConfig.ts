import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IPollConfig } from '@typings/schemas';

export default model<IPollConfig>(
  'Poll-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    logEnabled: reqBool,
    logChannel: reqString,
  }),
);
