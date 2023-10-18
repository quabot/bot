import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import Ids from '@schemas/Ids';
import { IIds } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getIdConfig(guildId: Snowflake, client: Client) {
  return await getFromCollection<IIds>({
    Schema: Ids,
    query: { guildId },
    cacheName: `${guildId}-ids`,
    client,
    defaultObj: {
      guildId,
      suggestId: 0,
      giveawayId: 0,
      pollId: 0,
      ticketId: 1,
    },
  });
}
