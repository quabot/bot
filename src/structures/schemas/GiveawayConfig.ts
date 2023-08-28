import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';

export default model(
  'Giveaway-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    pingEveryone: reqBool,
  }),
);
