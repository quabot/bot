import { EventArgs } from '@typings/functionArgs';
import { Events, Message } from 'discord.js';
import excessiveCaps from './excessiveCaps';
import excessiveEmojis from './excessiveEmojis';
import externalLinks from './externalLinks';
import serverInvites from './serverInvites';
import excessiveMentions from './excessiveMentions';

export default {
  event: Events.MessageUpdate,
  name: 'automodMessageEdit',

  async execute({ client, color }: EventArgs, _: Message, newMessage: Message) {
    excessiveCaps.execute({ client, color }, newMessage);
    excessiveEmojis.execute({ client, color }, newMessage);
    externalLinks.execute({ client, color }, newMessage);
    serverInvites.execute({ client, color }, newMessage);
    excessiveMentions.execute({ client, color }, newMessage);
  },
};
