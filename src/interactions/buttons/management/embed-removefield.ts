import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-removefield',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-removefield-modal')
      .setTitle('Remove Embed Field')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('index')
            .setLabel('Field to remove')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(2)
            .setPlaceholder('1'),
        ),
      );

    await interaction.showModal(mainModal);

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(() => null);

    if (modal) {
      if (modal.customId !== 'embed-removefield-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const index = parseInt(modal.fields.getTextInputValue('index'));
      if (!index)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No index entered, try again.')],
        });

      const indexSplice = interaction.message.embeds[1].data.fields ? index - 1 : 0;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).spliceFields(indexSplice, 1),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Field deleted'.slice(0, 2000))],
      });
    }
  },
};
