import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';

export default model(
  'Afk-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
  }),
);
