import { Schema, model } from 'mongoose';
import { reqString } from '@constants/schemas';
import type { IVote } from '@typings/schemas';

export default model<IVote>(
  'Vote',
  new Schema({
    userId: reqString,
    lastVote: reqString,
  }),
);
