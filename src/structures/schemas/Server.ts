import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';

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
