import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  type EmbedAuthorData,
} from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { prepareEmbed } from '@functions/discord';

export default {
  name: 'embed-author',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-author-modal')
      .setTitle('Embed Author')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('text')
            .setLabel('Author Name')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.author?.name ?? '')
            .setRequired(true)
            .setMaxLength(256)
            .setPlaceholder('My author name...'),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('icon')
            .setLabel('Author Icon')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.author?.icon_url ?? '')

            .setMaxLength(250)
            .setPlaceholder('Insert your favorite author icon here...'),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('url')
            .setLabel('Author Url')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.author?.url ?? '')

            .setMaxLength(250)
            .setPlaceholder('https://quabot.net'),
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
      if (modal.customId !== 'embed-author-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const text = modal.fields.getTextInputValue('text');
      let url: string | null = modal.fields.getTextInputValue('url');
      let icon: string | null = modal.fields.getTextInputValue('icon');
      if (!text)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Not all fields were filled out, try again.')],
        });

      if (!isValidHttpUrl(url)) url = null;
      if (!isValidHttpUrl(icon)) icon = null;

      const author: EmbedAuthorData = { name: text };
      if (icon) author.iconURL = icon;
      if (url) author.url = url;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          prepareEmbed(interaction.message.embeds[1]).setAuthor(author),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Changed the author!')],
      });
    }
  },
};
