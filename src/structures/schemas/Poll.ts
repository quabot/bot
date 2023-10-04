import { Schema, model } from 'mongoose';
import { reqString, reqArray, reqNum, optString } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Poll',
  new Schema({
    guildId: reqString,
    id: reqNum,
    channel: reqString,
    message: reqString,
    interaction: reqString,
    role: optString,

    topic: reqString,
    description: reqString,

    duration: reqString,
    optionsCount: reqNum,
    options: reqArray,

    created: reqString,
    endTimestamp: reqString,
  }),
);
