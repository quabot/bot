import { EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-timestamp',

  async execute({ interaction, color }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    await interaction.message.edit({
      embeds: [
        EmbedBuilder.from(interaction.message.embeds[0]),
        EmbedBuilder.from(interaction.message.embeds[1]).setTimestamp(),
      ],
    });

    await interaction.editReply({
      embeds: [new Embed(color).setDescription('Set the timestamp!')],
    });
  },
};
