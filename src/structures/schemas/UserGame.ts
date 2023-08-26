import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqObject } from '@constants/schemas';
import type { UserGame } from '@typings/mongoose';

export default model<UserGame>(
  'User-Game',
  new Schema<UserGame>({
    userId: reqString,
    typePoints: reqNum,
    typeTries: reqNum,
    typeFastest: reqNum,

    quizTries: reqNum,
    quizPoints: reqNum,

    rpsTries: reqNum,
    rpsPoints: reqNum,

    birthday: reqObject,
    bio: reqString,
  }),
);
