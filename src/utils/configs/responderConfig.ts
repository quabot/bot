import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import ResponderConfig from '@schemas/ResponderConfig';
import { IResponderConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getResponderConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IResponderConfig>({
    Schema: ResponderConfig,
    query: { guildId },
    cacheName: `${guildId}-responder-config`,
    client,
    defaultObj: {
      guildId,
      enabled: true,
    },
  });
}
