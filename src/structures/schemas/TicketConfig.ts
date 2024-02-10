import { Schema, model } from 'mongoose';
import { reqString, reqBool, reqArray, reqNum, reqObject } from '@constants/schemas';
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
    inactiveDaysToDelete: reqNum,

    staffRoles: reqArray,
    staffPing: reqString,
    topicButton: reqBool,

    dmEnabled: reqBool,
    dmMessages: reqObject,

    logChannel: reqString,
    logActions: reqArray,
    logEnabled: reqBool,
  }),
);
