import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import PollConfig from '@schemas/PollConfig';
import { IPollConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getPollConfig(client: Client, guildId: Snowflake) {
  return await getFromCollection<IPollConfig>({
    Schema: PollConfig,
    query: { guildId },
    cacheName: `${guildId}-poll-config`,
    client,
    defaultObj: {
      guildId,
      enabled: true,
      logEnabled: false,
      logChannel: 'none',
    },
  });
}
