import { Schema, model } from 'mongoose';
import { reqString, reqArray, optString } from '@constants/schemas';

//! type has to be added, but arrayTypes are weird in Mongoose
export default model(
  'Application-Answer',
  new Schema({
    guildId: reqString,
    id: reqString, // Application ID
    response_uuid: reqString, // unique identifier for the response
    userId: optString, // user id or none if anonymous
    time: reqString, // time of fillout
    answers: reqArray, // the users answers
    state: reqString, // pending, approved or denied
  }),
);
