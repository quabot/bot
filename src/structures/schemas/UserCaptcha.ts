import { Schema, model } from 'mongoose';
import { reqString, reqNum } from '@constants/schemas';
import type { IUserCaptcha } from '@typings/schemas';

export default model<IUserCaptcha>(
  'User-Captchas',
  new Schema({
    guildId: reqString,
    date: reqNum,
    id: reqString,
    lastAttempt: reqNum,
    userId: reqString,
  }),
);
