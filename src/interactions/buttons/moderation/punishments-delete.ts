import { ActionRowBuilder, ButtonStyle, ButtonBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import Punishment from '@schemas/Punishment';

export default {
  name: 'delete-punishment',

  async execute({ interaction, color }: ButtonArgs) {
    const id = interaction.message.embeds[0].footer?.text;
    if (!id)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription('An internal error occurred: no punishment ID in embed footer found.'),
        ],
        ephemeral: true,
      });

    const punishment = await Punishment.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!punishment)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no punishment found for the ID.')],
        ephemeral: true,
      });

    const row = new ActionRowBuilder<ButtonBuilder>().setComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Delete')
        .setEmoji('🗑️')
        .setDisabled(true)
        .setCustomId('delete-punishment'),
    );

    await interaction.update({
      components: [row],
    });

    await interaction.followUp({
      embeds: [new Embed(color).setDescription('Punishment deleted.')],
      ephemeral: true,
    });

    await Punishment.deleteOne({ guildId: interaction.guildId, id });
  },
};
