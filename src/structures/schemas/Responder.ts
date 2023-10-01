import { Schema, model } from 'mongoose';
import { reqString, reqBool, optString, reqArray, optObject } from '@constants/schemas';
import { IResponder } from '@typings/mongoose';

export default model(
  'Responses',
  new Schema<IResponder>({
    guildId: reqString,
    trigger: reqString,
    wildcard: reqBool,

    type: reqString,
    embed: optObject,
    message: optString,
    reaction: optString,

    //@ts-ignore
    ignored_channels: reqArray,
    ignored_roles: reqArray,
  }),
);
