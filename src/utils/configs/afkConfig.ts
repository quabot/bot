import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import AfkConfig from '@schemas/AfkConfig';
import { IAfkConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getAfkConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IAfkConfig>({
    Schema: AfkConfig,
    query: { guildId },
    cacheName: `${guildId}-afk-config`,
    client,
    defaultObj: {
      guildId,
      enabled: false,
    },
  });
}
