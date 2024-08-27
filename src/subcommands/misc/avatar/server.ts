import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'avatar',
  name: 'server',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const guild = interaction.guild!;

    //* If no avatar
    if (!guild.iconURL()) {
      return await interaction.editReply({
        embeds: [
          new Embed(color)
            .setDescription('This server has no avatar.')
            .setTitle(`${guild.name}'s avatar`),
        ],
      });
    }

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setImage(
            guild.iconURL({ size: 1024, forceStatic: false }) ??
              'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png',
          )
          .setTitle(`${guild.name}'s avatar`),
      ],
    });
  },
};
