import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import ApplicationConfig from '@schemas/ApplicationConfig';
import { IApplicationConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getApplicationConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IApplicationConfig>({
    Schema: ApplicationConfig,
    query: { guildId },
    cacheName: `${guildId}-application-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
    },
  });
}
