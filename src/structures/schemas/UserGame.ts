import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqObject } from '@constants/schemas';
import { IUserGame } from '@typings/mongoose';

export default model(
  'User-Game',
  new Schema<IUserGame>({
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
