import { Message } from 'discord.js';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import { getServerConfig } from '@configs/serverConfig';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: 'messageCreate',
  name: 'afkStatus',

  async execute({ client }: EventArgs, message: Message) {
    const userId = message.author.id ?? '';
    if (!userId) return;
    if (message.author.bot) return;
    if (!message.guildId) return;

    const config = await getUser(message.guildId, userId, client);
    const configColor = await getServerConfig(client, message.guildId);
    const color = configColor?.color ?? '#416683';
    if (!config || !color) return;

    if (config.afk) {
      config.afk = false;
      config.save();

      message.reply({
        embeds: [new Embed(color).setDescription('Removed your afk status!')],
      });
    }
  },
};
