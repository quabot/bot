import type { Snowflake } from 'discord.js';
import UserGame from '@schemas/UserGame';

export async function getUserGame(userId: Snowflake) {
  try {
    return (
      (await UserGame.findOne({ userId })
        .clone()
        .catch(() => {})) ??
      (await new UserGame({
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
      }).save())
    );
  } catch (err) {
    console.log(err);
  }
}
