import { endGiveaway } from '@functions/giveaway';
import type { EventArgs } from '@typings/functionArgs';
import Giveaway from '@schemas/Giveaway';

module.exports = {
  event: 'ready',
  name: 'giveawayRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const giveaways = await Giveaway.find({ ended: false });

    giveaways.forEach(async giveaway => {
      if (parseInt(giveaway.endTimestamp) < new Date().getTime()) {
        return await endGiveaway(client, giveaway);
      }

      const timeToGiveawayEnd = parseInt(giveaway.endTimestamp) - new Date().getTime();
      setTimeout(async () => {
        await endGiveaway(client, giveaway, false);
      }, timeToGiveawayEnd);
    });
  },
};
