import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';
import type { IApplicationAnswer } from '@typings/schemas';

export default model<IApplicationAnswer>(
  'Application-Answer',
  new Schema({
    guildId: reqString,
    id: reqString, // Application ID
    response_uuid: reqString, // unique identifier for the response
    //! should NEVER be undefined, we NEED it for giving roles, sending messages etc.
    userId: reqString, // user id or none if anonymous
    time: { type: Date, required: true }, // time of fillout
    answers: reqArray, // the users answers
    state: reqString, // pending, approved or denied
  }),
);
