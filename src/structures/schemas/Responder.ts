import { Schema, model } from 'mongoose';
import { reqString, reqBool, optString, reqArray, optObject } from '@constants/schemas';
import type { IResponder } from '@typings/schemas';

export default model<IResponder>(
  'Responses',
  new Schema({
    guildId: reqString,
    trigger: reqString,
    wildcard: reqBool,

    type: reqString,
    embed: optObject,
    message: optString,
    reaction: optString,

    ignored_channels: reqArray,
    ignored_roles: reqArray,
  }),
);
