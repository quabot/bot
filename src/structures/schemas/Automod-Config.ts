import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray, reqObject, reqNum } from '@constants/schemas';
import type { IAutomodConfig } from '@typings/schemas';

export default model<IAutomodConfig>(
  'Automod-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    ignoredChannels: reqArray,
    ignoredRoles: reqArray,
    logChannel: reqString,
    logsEnabled: reqBool,
    alert: reqBool,
    deleteAlertAfter: reqNum,
    serverInvites: reqObject,
    externalLinks: reqObject,
    excessiveCaps: reqObject,
    excessiveEmojis: reqObject,
    excessiveMentions: reqObject,
    excessiveSpoilers: reqObject,
    newLines: reqObject,
    profanityFilter: reqObject,
    chatCooldown: reqObject,
    attachmentsCooldown: reqObject,
    mentionsCooldown: reqObject,
    repeatedText: reqObject,
  }),
);
