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

      enabled: false,
      openCategory: 'none',
      closedCategory: 'none',

      guildMax: -1,
      userMax: -1,
      deleteOnClose: true,

      staffPing: 'none',
      topicButton: true,

      logChannel: 'none',
      logEnabled: false,
    },
  });
}
