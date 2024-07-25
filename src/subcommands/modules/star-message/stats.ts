import { Embed } from '@constants/embed';
import StarMessage from '@schemas/StarMessage';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'star-messages',
  name: 'stats',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const user = interaction.options.getUser('user') ?? interaction.user;
    const starMessages = await StarMessage.find({ userId: user.id }).sort({ date: 1 });

    if (starMessages.length === 0) return await interaction.editReply({
      embeds: [
        new Embed(color).setDescription('This user has no messages in the star channel!'),
      ],
    });

    await interaction.editReply({
      embeds: [
        new Embed(color).setTitle(`@${user.username}'s Starboard Stats`)
          .setDescription(`This user has ${starMessages.length} messages in the star channel.`).addFields([
            { name: 'Total Stars', value: `${starMessages.reduce((acc, curr) => acc + curr.stars, 0)}`, inline: true },
            { name: 'First Star Message', value: `<t:${Math.floor(starMessages[0].date / 1000)}:R>`, inline: true },
            { name: 'Lastest Star Message', value: `<t:${Math.floor(starMessages[starMessages.length - 1].date / 1000)}:R>`, inline: true },
          ]),
      ],
    });
  },
};
