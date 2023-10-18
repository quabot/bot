import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import { IResponderConfig } from '@typings/schemas';

export default model<IResponderConfig>(
  'Responder-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
  }),
);
