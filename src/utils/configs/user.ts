import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import User from '@schemas/User';
import { IUser } from '@typings/schemas';

export async function getUser(guildId: Snowflake, userId: Snowflake) {
  return await getFromCollection<IUser>({
    Schema: User,
    query: { guildId, userId },
    defaultObj: {
      guildId,
      userId,
      bans: 0,
      tempbans: 0,
      warns: 0,
      kicks: 0,
      timeouts: 0,

      afk: false,
      afkMessage: 'No afk message set.',
    },
  });
}
