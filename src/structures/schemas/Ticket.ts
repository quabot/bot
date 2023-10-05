import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Ticket',
  new Schema({
    guildId: reqString,

    id: reqString,
    channelId: reqString,

    topic: reqString,
    closed: reqBool,

    owner: reqString,
    users: reqArray,
    staff: reqString,
  }),
);
