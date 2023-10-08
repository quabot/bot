import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import Level from '@schemas/Level';
import { ILevel } from '@typings/schemas';
import type { Client } from '@classes/discord';

export async function getLevel(guildId: Snowflake, userId: Snowflake, client: Client) {
  return await getFromCollection<ILevel>({
    Schema: Level,
    query: { guildId, userId },
    cacheName: `${guildId}&${userId}-level`,
    client,
    defaultObj: {
      guildId,
      userId,
      xp: 0,
      level: 0,
      role: 'none',
      active: true,
    },
  });
}
