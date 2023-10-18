import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IApplicationConfig } from '@typings/schemas';

export default model<IApplicationConfig>(
  'Application-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
  }),
);
