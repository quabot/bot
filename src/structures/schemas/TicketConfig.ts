import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Ticket-Config',
  new Schema({
    guildId: reqString,

    enabled: reqBool,
    openCategory: reqString,
    closedCategory: reqString,

    staffRoles: reqArray,
    staffPing: reqString,
    topicButton: reqBool,

    logChannel: reqString,
    logEnabled: reqBool,
  }),
);
