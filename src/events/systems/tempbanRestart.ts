import type { EventArgs } from '@typings/functionArgs';
import ms from 'ms';
import Punishment from '@schemas/Punishment';
import { tempUnban } from '@functions/unban';

export default {
  event: 'ready',
  name: 'tempbanRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const Punishments = await Punishment.find({
      type: 'tempban',
      active: true,
    });

    Punishments.forEach(async punishment => {
      let timeToUnban = parseInt(punishment.time) - new Date().getTime() + ms(punishment.duration);
      if (timeToUnban < 0) timeToUnban = 1;

      setTimeout(async () => {
        await tempUnban(client, punishment);
      }, timeToUnban);
    });
  },
};
