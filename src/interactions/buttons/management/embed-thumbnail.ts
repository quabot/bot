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
  name: 'embed-thumbnail',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-thumbnail-modal')
      .setTitle('Embed Thumbnail')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('thumbnail')
            .setLabel('New thumbnail')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.thumbnail?.url ?? '')
            .setRequired(true)
            .setMaxLength(500)
            .setPlaceholder('Insert your awesome hippo photo url here...'),
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
      if (modal.customId !== 'embed-thumbnail-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const thumbnail = modal.fields.getTextInputValue('thumbnail');
      if (!thumbnail)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No thumbnail entered, try again.')],
        });

      if (!isValidHttpUrl(thumbnail))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid thumbnail entered, try again.')],
        });

      const newEmbed = prepareEmbed(interaction.message.embeds[1]);

      newEmbed.thumbnail = { url: thumbnail };

      await interaction.message.edit({
        embeds: [EmbedBuilder.from(interaction.message.embeds[0]), newEmbed as DiscordEmbed],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the thumbnail to: \n**${thumbnail}**`.slice(0, 2000))],
      });
    }
  },
};
