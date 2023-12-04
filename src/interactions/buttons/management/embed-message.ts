import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-message',

  async execute({ interaction, color }: ButtonArgs) {
    const messageModal = new ModalBuilder()
      .setCustomId('embed-message-modal')
      .setTitle('Message Above Embed')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('message')
            .setLabel('New message')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.content ?? '')
            .setRequired(false)
            .setMaxLength(1950)
            .setPlaceholder('This is my message!'),
        ),
      );

    await interaction.showModal(messageModal);

    const modal = await interaction
      .awaitModalSubmit({
        time: 180000,
        filter: i => i.user.id === interaction.user.id,
      })
      .catch(() => null);

    if (modal) {
      if (modal.customId !== 'embed-message-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const message = modal.fields.getTextInputValue('message') || null;

      await interaction.message.edit({
        content: message,
      });

      if (!message) {
        return await modal.editReply('Deleted the message.');
      }

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the message to: \n**${message}**`.slice(0, 2000))],
      });
    }
  },
};
