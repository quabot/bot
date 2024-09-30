import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject, reqArray } from '@constants/schemas';
import type { IVerificationConfig } from '@typings/schemas';

export default model<IVerificationConfig>(
  'Verification-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    roles: reqArray,
    removeRoles: reqArray,
    dm: reqBool,
    dmMessage: reqObject,
    type: reqString,
    cooldown: reqString,
  }),
);
