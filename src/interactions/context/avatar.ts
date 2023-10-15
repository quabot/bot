import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ContextArgs } from '@typings/functionArgs';

module.exports = {
  data: new ContextMenuCommandBuilder().setName('Avatar').setType(ApplicationCommandType.User).setDMPermission(false),

  async execute({ interaction, color }: ContextArgs) {
    await interaction.deferReply();

    const user = interaction.targetUser;
    if (!user) return await interaction.editReply("Couldn't find a user.");

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setImage(
            user.avatarURL({ size: 1024, forceStatic: false }) ??
              'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png',
          )
          .setTitle(`${user.username}'s avatar`),
      ],
    });
  },
};
