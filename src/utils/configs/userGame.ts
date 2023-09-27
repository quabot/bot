import type { Snowflake } from 'discord.js';
import UserGame from '@schemas/UserGame';
import { getFromCollection } from '@functions/mongoose';
import { Client } from '@classes/discord';
import { IUserGame } from '@typings/schemas';

export async function getUserGame(userId: Snowflake, client: Client) {
  return await getFromCollection<IUserGame>({
    Schema: UserGame,
    query: { userId },
    client,
    cacheName: `${userId}-user-game`,
    defaultObj: {
      userId,
      typePoints: 0,
      typeTries: 0,
      typeFastest: 15,

      quizTries: 0,
      quizPoints: 0,

      rpsTries: 0,
      rpsPoints: 0,

      bio: '-',
      birthday: {
        configured: false,
        day: 0,
        month: 0,
        year: 0,
      },
    },
  });
}
