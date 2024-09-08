import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';
import type { IAutomationConfig } from '@typings/schemas';

export default model<IAutomationConfig>(
  'Automation-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    buttons: reqArray
  }),
);
