import type { Snowflake } from 'discord.js';
import { getFromCollection } from '@functions/mongoose';
import EconomyUser from '@schemas/EconomyUser';
import { EconomyUser as IEconomyUser } from '@typings/economy';

export async function getEconomyUser(userId: Snowflake) {
  return await getFromCollection<IEconomyUser>({
    Schema: EconomyUser,
    query: { userId },
    defaultObj: {
      userId,
      walletCoins: 0,
      bankCoins: 0,
      walletSize: 0,
      passive: false,
      lastRobbedBy: 0,
      cooldowns: {
        gamble: 0,
        beg: 0,
        fish: 0,
        hack: 0,
        game: 0,
        socialMedia: 0,
        stream: 0,
        rob: 0,
        bankRob: 0,
        work: 0,
      },
      achievements: [],
      inventory: [],
      boosts: [],
      job: {
        job: 'none',
        strikes: [],
        performance: 5,
      },
    },
  });
}