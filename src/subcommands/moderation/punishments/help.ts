import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'punishments',
  name: 'help',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle('What is the Punishments module and how do i use it?')
          .setDescription(`The punishments module is a way for you to moderate your server. You can warn, ban, kick or timeout users. Warns are a general warning, timeouts mute a user, kick and ban speak for themselves. If enabled, users will receive a DM when they get punished. A full list of commands:
					\`/ban\` - Ban a user.
					\`/kick\` - Kick a user.
					\`/punishments\` - Manage punishments.
					\`/tempban\` - Temporarily ban a user.
					\`timeout\` - Timeout a user.
					\`/unban\` - Unban a user.
					\`/untimeout\` - Remove the timeout from a user.
					\`/warn\` - Warn a user.`),
      ],
    });
  },
};
