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
          .setImage(user.displayAvatarURL({ size: 1024, forceStatic: false }))
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
