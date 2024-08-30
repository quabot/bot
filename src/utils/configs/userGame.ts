import type { Snowflake } from 'discord.js';
import UserGame from '@schemas/UserGame';
import { getFromCollection } from '@functions/mongoose';
import { IUserGame } from '@typings/schemas';

export async function getUserGame(userId: Snowflake) {
  return await getFromCollection<IUserGame>({
    Schema: UserGame,
    query: { userId },
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
      birthday: new Date(),
      birthday_set: false,
    },
  });
}
