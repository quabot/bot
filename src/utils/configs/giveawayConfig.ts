import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import GiveawayConfig from '@schemas/GiveawayConfig';
import { IGiveawayConfig } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getGiveawayConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IGiveawayConfig>({
    Schema: GiveawayConfig,
    query: { guildId },
    cacheName: `${guildId}-giveaway-config`,
    client,
    defaultObj: {
      guildId,
      enabled: true,
      pingEveryone: false,
    },
  });
}
