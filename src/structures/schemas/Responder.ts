import { Schema, model } from 'mongoose';
import { reqString, reqBool, optString, reqArray, optObject } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose

export default model(
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
