import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  Embed as DiscordEmbed,
} from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { prepareEmbed } from '@functions/discord';

export default {
  name: 'embed-footer',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-footer-modal')
      .setTitle('Embed Footer')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('text')
            .setLabel('Footer Text')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.footer?.text ?? '')
            .setRequired(true)
            .setMaxLength(2048)
            .setPlaceholder('My footer text...'),
        ),
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('icon')
            .setLabel('Footer Icon')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.footer?.icon_url ?? '')

            .setMaxLength(500)
            .setPlaceholder('Insert your favorite footer image here...'),
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
      if (modal.customId !== 'embed-footer-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const text = modal.fields.getTextInputValue('text');
      let url: string | null = modal.fields.getTextInputValue('icon');
      if (!text)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Not all fields were filled out, try again.')],
        });

      if (!isValidHttpUrl(url)) url = null;

      const newEmbed = prepareEmbed(interaction.message.embeds[1]);

      newEmbed.footer = { text };
      if (url) newEmbed.footer.iconURL = url;

      await interaction.message.edit({
        embeds: [EmbedBuilder.from(interaction.message.embeds[0]), newEmbed as DiscordEmbed],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Changed the footer!')],
      });
    }
  },
};
