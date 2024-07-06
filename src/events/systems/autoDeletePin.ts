import type { EventArgs } from '@typings/functionArgs';
import { Message, MessageType } from 'discord.js';

export default {
  event: 'messageCreate',
  name: 'autoDeletePin',

  async execute({ client }: EventArgs, message: Message) {
    if (!message.guildId) return;

    if (message.author.bot && message.type === MessageType.ChannelPinnedMessage && message.author.id === client.user?.id) {
      await message.delete().catch(() => null);
    }
  },
};
