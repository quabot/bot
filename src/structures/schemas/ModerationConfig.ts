import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject } from '@constants/schemas';

//! type has to be added, but this boolType is also weird in Mongoose
export default model(
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
  }),
);
