import { Schema, model } from 'mongoose';
import { reqString, reqNum } from '@constants/schemas';
import { ISuggestion } from '@typings/schemas';

export default model<ISuggestion>(
  'Suggestion',
  new Schema({
    guildId: reqString,
    id: reqNum,
    msgId: reqString,
    suggestion: reqString,
    status: reqString,
    userId: reqString,
  }),
);
