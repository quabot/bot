import { reqArray, reqBool, reqNum, reqObject, reqString } from '@constants/schemas';
import { IStarMessagesConfig } from '@typings/mongoose';
import { Schema, model } from 'mongoose';

export default model<IStarMessagesConfig>(
  'Star-Messages-Config',
  new Schema({
    guildId: reqString,
      channel: reqString,
      enabled: reqBool,
      emoji: reqString,
      message: reqObject,
      minStars: reqNum,
      notifyUser: reqBool,
      ignoredChannels: reqArray,
  }),
);
