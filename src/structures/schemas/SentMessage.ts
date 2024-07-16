import { Schema, model } from 'mongoose';
import { ISentMessages } from '../../utils/typings/schemas';
import { reqObject, reqString } from '@constants/schemas';

export default model<ISentMessages>(
  'Sent-Messages',
  new Schema({
    guildId: reqString,
    message: reqObject,
    date: reqString,
    id: reqString,
    channel: reqString,
    user: reqString,
    title: reqString,
  }),
);
