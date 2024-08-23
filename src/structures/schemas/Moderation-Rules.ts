import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IModerationRules } from '@typings/schemas';

export default model<IModerationRules>(
  'Moderation-Rules',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    title: reqString,
    trigger: {
      type: reqString,
      amount: Number,
      time: reqString,
    },
    action: {
      type: reqString,
      reason: reqString,
      duration: reqString
    }
  }),
);
