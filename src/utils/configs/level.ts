import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import Level from '@schemas/Level';
import { ILevel } from '@typings/schemas';

export async function getLevel(guildId: Snowflake, userId: Snowflake) {
  return await getFromCollection<ILevel>({
    Schema: Level,
    query: { guildId, userId },
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
