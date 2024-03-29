import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import Server from '@schemas/Server';
import { IServer } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getServerConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IServer>({
    Schema: Server,
    query: { guildId },
    cacheName: `${guildId}-server-config`,
    client,
    defaultObj: {
      guildId,
      locale: 'en-us',
      color: '#416683',
      updatesChannel: 'none',
    },
  });
}
