import { reqNum, reqString } from '@constants/schemas';
import { IStarMessage } from '@typings/mongoose';
import { Schema, model } from 'mongoose';

export default model<IStarMessage>(
  'Star-Messages',
  new Schema({
    guildId: reqString,
    channelId: reqString,
    userId: reqString,
    messageId: reqString,
    stars: reqNum,
    starboardId: reqString,
    date: reqNum,
  }),
);
