import { Schema, model } from 'mongoose';
import { reqString, optId } from '@constants/schemas';
import type { IIds } from '@typings/schemas';

export default model<IIds>(
  'Id',
  new Schema({
    guildId: reqString,
    suggestId: optId,
    giveawayId: optId,
    pollId: optId,
    ticketId: optId,
  }),
);
