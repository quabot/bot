import { Schema, model } from 'mongoose';
import { reqString, reqNum, reqDate, reqBool } from '@constants/schemas';
import { IUserGame } from '@typings/schemas';

export default model<IUserGame>(
  'User-Game',
  new Schema({
    userId: reqString,
    typePoints: reqNum,
    typeTries: reqNum,
    typeFastest: reqNum,

    quizTries: reqNum,
    quizPoints: reqNum,

    rpsTries: reqNum,
    rpsPoints: reqNum,

    birthday: reqDate,
    birthday_set: reqBool,
    bio: reqString,
  }),
);
