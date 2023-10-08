import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject, reqArray } from '@constants/schemas';
import { IWelcomeConfig } from '@typings/schemas';

export default model<IWelcomeConfig>(
  'Welcome-Config',
  new Schema({
    guildId: reqString,

    joinEnabled: reqBool,
    joinChannel: reqString,
    joinType: reqString,
    joinMessage: reqObject,

    leaveEnabled: reqBool,
    leaveChannel: reqString,
    leaveType: reqString,
    leaveMessage: reqObject,

    joinRole: reqArray,
    joinRoleEnabled: reqBool,

    joinDM: reqBool,
    joinDMType: reqString,
    dm: reqObject,
  }),
);
