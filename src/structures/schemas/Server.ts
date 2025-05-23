import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';
import type { IServer } from '@typings/schemas';

export default model<IServer>(
  'Server',
  new Schema({
    guildId: reqString,
    locale: reqString,
    footer: reqString,
    footer_icon: reqString,
    color: reqString,
    updatesChannel: reqString,
    disabledCommands: reqArray,
  }),
);
