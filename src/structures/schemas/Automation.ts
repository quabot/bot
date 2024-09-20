import { Schema, model } from 'mongoose';
import { reqString, reqBool, automationIfArray, automationActionArray } from '@constants/schemas';
import type { IAutomation } from '@typings/schemas';

export default model<IAutomation>(
  'Automation',
  new Schema({
    guildId: reqString,
    name: reqString,
    enabled: reqBool,
    trigger: reqString,
    if: automationIfArray,
    action: automationActionArray
  }),
);
