import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Reaction-Roles',
  new Schema({
    guildId: reqString,
    channelId: reqString,
    reqPermission: reqString,
    reqRoles: reqArray,
    excludedRoles: reqArray,
    roleId: reqString,
    messageId: reqString,
    emoji: reqString,
    type: reqString,
  }),
);
