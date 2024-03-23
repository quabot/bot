import { Schema, model } from 'mongoose';
import { reqString, reqBool } from '@constants/schemas';
import type { IGiveawayConfig } from '@typings/schemas';

export default model<IGiveawayConfig>(
  'Giveaway-Config',
  new Schema({
    guildId: reqString,
    enabled: reqBool,
    pingRole: reqString,
  }),
);
