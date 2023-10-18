import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray } from '@constants/schemas';
import type { ITicket } from '@typings/schemas';

export default model<ITicket>(
  'Ticket',
  new Schema({
    guildId: reqString,

    id: reqString,
    channelId: reqString,

    topic: reqString,
    closed: reqBool,

    owner: reqString,
    users: reqArray,
    staff: reqString,
  }),
);
