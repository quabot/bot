import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import { getServerConfig } from '@configs/serverConfig';
import type { EventArgs } from '@typings/functionArgs';
import type { Message } from 'discord.js';

export default {
  event: 'messageCreate',
  name: 'afkHandler',

  async execute({ client }: EventArgs, message: Message) {
    if (message.author.bot) return;
    if (!message.guildId) return;

    const user = message.mentions.users.first();
    if (!user) return;
    if (user.bot) return;

    const config = await getUser(message.guildId, user.id);
    const configColor = await getServerConfig(client, message.guildId);
    const color = configColor?.color ?? '#416683';
    if (!config || !color) return;

    if (config.userId === user.id) return;

    if (config.afk) {
      message.reply({
        embeds: [new Embed(color).setDescription(`${user.username} is afk.\n\`${config.afkMessage}\``)],
      });
    }
  },
};
