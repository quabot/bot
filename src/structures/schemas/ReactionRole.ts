import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';
import type { IReactionRoles } from '@typings/schemas';

export default model<IReactionRoles>(
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
