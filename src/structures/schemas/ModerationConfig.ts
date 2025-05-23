import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject, reqArray } from '@constants/schemas';
import type { IModerationConfig } from '@typings/schemas';

export default model<IModerationConfig>(
  'Moderation-Config',
  new Schema({
    guildId: reqString,
    channel: reqBool,
    channelId: reqString,

    warnDM: reqBool,
    warnDMMessage: reqObject,

    timeoutDM: reqBool,
    timeoutDMMessage: reqObject,

    kickDM: reqBool,
    kickDMMessage: reqObject,

    banDM: reqBool,
    banDMMessage: reqObject,

    tempbanDM: reqBool,
    tempbanDMMessage: reqObject,


    reportEnabled: reqBool,
    reportChannelId: reqString,

    appealEnabled: reqBool,
    appealChannelId: reqString,
    appealTypes: reqArray,
    appealQuestions: reqArray,
  }),
);
