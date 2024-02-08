import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray, reqNum } from '@constants/schemas';
import type { ITicketConfig } from '@typings/schemas';

export default model<ITicketConfig>(
  'Ticket-Config',
  new Schema({
    guildId: reqString,

    enabled: reqBool,
    openCategory: reqString,
    closedCategory: reqString,

    guildMax: reqNum,
    userMax: reqNum,
    deleteOnClose: reqBool,

    staffRoles: reqArray,
    staffPing: reqString,
    topicButton: reqBool,

    logChannel: reqString,
    logEnabled: reqBool,
  }),
);
