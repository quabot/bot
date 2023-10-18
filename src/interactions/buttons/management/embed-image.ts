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
  name: 'embed-image',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-image-modal')
      .setTitle('Embed Image')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('image')
            .setLabel('New image')
            .setValue(interaction.message.embeds[1].data.image?.url ?? '')
            .setStyle(TextInputStyle.Paragraph)
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
      if (modal.customId !== 'embed-image-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const image = modal.fields.getTextInputValue('image');
      if (!image)
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No image entered, try again.')],
        });

      if (!isValidHttpUrl(image))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid image entered, try again.')],
        });

      const newEmbed = prepareEmbed(interaction.message.embeds[1]);

      newEmbed.image = { url: image };

      await interaction.message.edit({
        embeds: [EmbedBuilder.from(interaction.message.embeds[0]), newEmbed as DiscordEmbed],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the image to: \n**${image}**`.slice(0, 2000))],
      });
    }
  },
};
