import type { Document as MongooseDoc, Types } from 'mongoose';

//* The return type of Mongoose function like 'findOne' and 'save'
export type MongooseReturn<T> = NonNullMongooseReturn<T> | null;

//* The return type of Mongoose function like 'findOne' and 'save' when it may not be null
export type NonNullMongooseReturn<T> = MongooseDoc<unknown, any, T> &
  Omit<
    T & {
      _id: Types.ObjectId;
    },
    never
  >;