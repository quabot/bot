import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Loggin-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    channelId: reqString,
    excludedChannels: reqArray,
    excludedCategories: reqArray,
    events: reqArray,
  }),
);
