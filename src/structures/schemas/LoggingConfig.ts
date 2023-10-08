import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';
import type { ILoggingConfig } from '@typings/schemas';

export default model<ILoggingConfig>(
  'Loggin-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    channelId: reqString,
    excludedChannels: reqArray,
    excludedCategories: reqArray,
    events: reqArray,
  }),
);
