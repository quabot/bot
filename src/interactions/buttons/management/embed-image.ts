import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { fixEmbed, prepareEmbed } from '@functions/discord';

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
            .setRequired(false)
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

      if (!image) {
        await interaction.message.edit({
          embeds: [
            EmbedBuilder.from(interaction.message.embeds[0]),
            fixEmbed(prepareEmbed(interaction.message.embeds[1]).setImage(null)),
          ],
        });

        await modal.editReply({
          embeds: [new Embed(color).setDescription(`Removed the image.`)],
        });
        return;
      }

      if (!isValidHttpUrl(image))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid image entered, try again.')],
        });

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          prepareEmbed(interaction.message.embeds[1]).setImage(image),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the image to: \n**${image}**`.slice(0, 2000))],
      });
    }
  },
};
