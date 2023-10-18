import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  Embed as DiscordEmbed,
} from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { prepareEmbed } from '@functions/discord';

export default {
  name: 'embed-addfield',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-addfield-modal')
      .setTitle('Embed Add Field')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('title')
            .setLabel('Field Title')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(256)
            .setPlaceholder('I am a field title!    '),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('value')
            .setLabel('Field Value')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(1024)
            .setPlaceholder('I am a field value!'),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('inline')
            .setLabel('Field inline?')
            .setStyle(TextInputStyle.Short)

            .setMaxLength(500)
            .setPlaceholder('true/false'),
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
      if (modal.customId !== 'embed-addfield-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const title = modal.fields.getTextInputValue('title');
      const value = modal.fields.getTextInputValue('value');
      const inline = modal.fields.getTextInputValue('inline') === 'true';
      if (!title || !value)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Not all fields were filled out, try again.')],
        });

      const newEmbed = prepareEmbed(interaction.message.embeds[1]);

      newEmbed.fields = newEmbed.fields.concat({ name: title, value, inline });

      await interaction.message.edit({
        embeds: [EmbedBuilder.from(interaction.message.embeds[0]), newEmbed as DiscordEmbed],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Added a field!')],
      });
    }
  },
};
