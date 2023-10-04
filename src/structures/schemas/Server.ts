import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Server',
  new Schema({
    guildId: reqString,
    locale: reqString,
    color: reqString,
    updatesChannel: reqString,
    disabledCommands: reqArray,
  }),
);
