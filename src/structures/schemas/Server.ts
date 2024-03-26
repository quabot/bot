import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';
import type { IServer } from '@typings/schemas';

export default model<IServer>(
  'Server',
  new Schema({
    guildId: reqString,
    nickname: reqString,
    locale: reqString,
    color: reqString,
    updatesChannel: reqString,
    disabledCommands: reqArray,
  }),
);
