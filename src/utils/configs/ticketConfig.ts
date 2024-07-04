import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import TicketConfig from '@schemas/TicketConfig';
import { ITicketConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getTicketConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<ITicketConfig>({
    Schema: TicketConfig,
    query: { guildId },
    cacheName: `${guildId}-ticket-config`,
    client,
    defaultObj: {
      guildId,

      enabled: true,
      openCategory: 'none',
      closedCategory: 'none',

      staffPing: 'none',
      topicButton: true,
      topicRequired: true,

      logChannel: 'none',
      logEnabled: false,
      logEvents: ['close', 'delete', 'reopen', 'create', 'add', 'remove', 'claim', 'unclaim', 'updated', 'transfer'],

      autoDeleteOnClose: false,
      ticketLimitUser: 0,
      ticketLimitGlobal: 0,

      dmEnabled: false,
      dmEvents: ['close', 'delete', 'reopen', 'claim', 'transfer'],

      autoClose: false,
      autoCloseDays: 0,

      autoRemind: true,
      autoRemindDays: 7,
    },
  });
}
