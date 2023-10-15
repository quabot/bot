import Poll from '@schemas/Poll';
import { endPoll } from '@functions/poll';
import type { EventArgs } from '@typings/functionArgs';

module.exports = {
  event: 'ready',
  name: 'pollRestart',
  once: true,

  async execute({ client }: EventArgs) {
    const Polls = await Poll.find();

    Polls.forEach(async poll => {
      if (parseInt(poll.endTimestamp) < new Date().getTime()) {
        return await endPoll(client, poll);
      }

      const timeToPollEnd = parseInt(poll.endTimestamp) - new Date().getTime();
      setTimeout(async () => {
        await endPoll(client, poll);
      }, timeToPollEnd);
    });
  },
};
