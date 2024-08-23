import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';
import type { ILoggingConfig } from '@typings/schemas';

export default model<ILoggingConfig>(
  'Logging-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    excludedChannels: reqArray,
    excludedCategories: reqArray,
    events: reqArray,
    logBotActions: reqBool,
  }),
);
