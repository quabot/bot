import { rollGiveaway } from '@functions/giveaway';
import type { EventArgs } from '@typings/functionArgs';
import Giveaway from '@schemas/Giveaway';

export default {
  event: 'ready',
  name: 'giveawayRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const giveaways = await Giveaway.find({ ended: false });

    giveaways.forEach(async giveaway => {
      if (parseInt(giveaway.endTimestamp) < new Date().getTime()) {
        return await rollGiveaway(client, giveaway, true);
      }

      const timeToGiveawayEnd = parseInt(giveaway.endTimestamp) - new Date().getTime();
      setTimeout(async () => {
        await rollGiveaway(client, giveaway, true);
      }, timeToGiveawayEnd);
    });
  },
};
