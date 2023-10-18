import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject } from '@constants/schemas';
import { ISuggestionConfig } from '@typings/schemas';

export default model<ISuggestionConfig>(
  'Suggestion-Config',
  new Schema({
    guildId: reqString,

    enabled: reqBool,
    channelId: reqString,

    logEnabled: reqBool,
    logChannelId: reqString,

    message: reqObject,
    emojiRed: reqString,
    emojiGreen: reqString,

    reasonRequired: reqBool,
    dm: reqBool,
    dmMessage: reqObject,

    colors: reqObject,
  }),
);
