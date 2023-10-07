import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
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
