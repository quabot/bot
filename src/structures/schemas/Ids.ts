import { Schema, model } from 'mongoose';
import { reqString, optId } from '@constants/schemas';

export default model(
  'Id',
  new Schema({
    guildId: reqString,
    suggestId: optId,
    giveawayId: optId,
    pollId: optId,
    ticketId: optId,
  }),
);
