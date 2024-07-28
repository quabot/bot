import { Schema, model } from 'mongoose';
import { reqString, reqArray, optString, reqBool, reqNum } from '@constants/schemas';
import type { IReactionRoles } from '@typings/schemas';

export default model<IReactionRoles>(
  'Reaction-Roles',
  new Schema({
    guildId: reqString,
    type: reqString,
    name: reqString,
    messageId: reqString,
    channelId: reqString,
    active: reqBool, // does it work rn
    buttons: reqArray,
    dropdown: reqArray,
    dropdownPlaceholder: optString, // dropdown placeholder
    reactions: reqArray, // the actual reaction role emojis/options
    mode: reqString,
    allowedRoles: reqArray,
    dropdownMax: reqNum,
    dropdownMin: reqNum,
    ignoredRoles: reqArray,
  }),
);
