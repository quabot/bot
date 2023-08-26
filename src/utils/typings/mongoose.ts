import type { Document as MongooseDoc, Types } from 'mongoose';

//* The return type of Mongoose function like 'findOne' and 'save'
export type MongooseReturn<T> =
  | (MongooseDoc<unknown, any, T> &
      Omit<
        T & {
          _id: Types.ObjectId;
        },
        never
      >)
  | null;

export interface IUserGame {
  userId: string;
  typePoints: number;
  typeTries: number;
  typeFastest: number;

  quizTries: number;
  quizPoints: number;

  rpsTries: number;
  rpsPoints: number;

  birthday: {
    configured: boolean;
    day: number;
    month: number;
    year: number;
  };
  bio: string;
}
