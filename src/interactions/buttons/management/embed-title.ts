import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { prepareEmbed } from '@functions/discord';

export default {
  name: 'embed-title',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-title-modal')
      .setTitle('Embed Title')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('title')
            .setLabel('New title')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.title ?? '')
            .setRequired(true)
            .setMaxLength(256)
            .setPlaceholder('This is my embed title!'),
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
      if (modal.customId !== 'embed-title-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const title = modal.fields.getTextInputValue('title');
      if (!title)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No title entered, try again.')],
        });

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          prepareEmbed(interaction.message.embeds[1]).setTitle(title),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the title to: \n**${title}**`.slice(0, 2000))],
      });
    }
  },
};
