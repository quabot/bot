import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import Ids from '@schemas/Ids';
import { IIds } from '@typings/schemas';

export async function getIdConfig(guildId: Snowflake) {
  return await getFromCollection<IIds>({
    Schema: Ids,
    query: { guildId },
    defaultObj: {
      guildId,
      suggestId: 0,
      giveawayId: 0,
      pollId: 0,
      ticketId: 1,
    },
  });
}
