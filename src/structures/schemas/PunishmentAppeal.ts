import { Schema, model } from 'mongoose';
import { reqString, reqArray } from '@constants/schemas';
import type {IPunishmentAppeal } from '@typings/schemas';

export default model<IPunishmentAppeal>(
  'Punishment-Appeal',
  new Schema({
    guildId: reqString,
    answers: reqArray,
    userId: reqString,
    punishmentId: reqString,
    response: reqString,
    state: reqString,
    type: reqString,
  }),
);
