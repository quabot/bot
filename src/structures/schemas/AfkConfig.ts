import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IAfkConfig } from '@typings/schemas';

export default model<IAfkConfig>(
  'Afk-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
  }),
);
