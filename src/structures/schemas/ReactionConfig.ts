import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqObject } from '@constants/schemas';
import type { IReactionConfig } from '@typings/schemas';

export default model<IReactionConfig>(
  'Reaction-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    dmEnabled: reqBool,
    dm: reqObject,
  }),
);
