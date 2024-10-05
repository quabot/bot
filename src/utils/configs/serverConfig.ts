import type { Snowflake } from 'discord.js';
import Server from '@schemas/Server';
import type { Client } from '@classes/discord';
import { IServer } from '@typings/schemas';
import { getFromCollection } from '@functions/mongoose';

export async function getServerConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IServer>({
    Schema: Server,
    query: { guildId },
    cacheName: `${guildId}-server-config`,
    client,
    defaultObj: {
      guildId,
      footer: 'quabot.net',
      footer_icon: 'https://quabot.net/logo512.png',
      locale: 'en-us',
      color: '#416683',
      updatesChannel: 'none',
    },
  });
}