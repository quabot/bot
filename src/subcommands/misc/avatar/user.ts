import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'avatar',
  name: 'user',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user') ?? interaction.user;

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setImage(
            user.avatarURL({ size: 1024, forceStatic: false }) ??
              'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png',
          )
          .setTitle(
            `${
              interaction.member && 'displayName' in interaction.member
                ? interaction.member.displayName
                : interaction.user.displayName
            }'s avatar`,
          ),
      ],
    });
  },
};
