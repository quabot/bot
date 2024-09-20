import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { prepareEmbed } from '@functions/discord';

export default {
  name: 'embed-url',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-url-modal')
      .setTitle('Embed Url')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('url')
            .setLabel('New url')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.url ?? '')
            .setRequired(false)
            .setMaxLength(500)
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
      if (modal.customId !== 'embed-url-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});

      if (!interaction.message.embeds[1].title) {
        return await modal.editReply({
          embeds: [new Embed(color).setDescription(`Can't change url when there's no title.`)],
        })
      }

      const url = modal.fields.getTextInputValue('url');

      if (!url) {
        await interaction.message.edit({
          embeds: [
            EmbedBuilder.from(interaction.message.embeds[0]),
            prepareEmbed(interaction.message.embeds[1]).setURL(null),
          ],
        });

        return await modal.editReply({
          embeds: [new Embed(color).setDescription('Removed url.')],
        });
      }

      if (!isValidHttpUrl(url))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid url entered, try again.')],
        });

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          prepareEmbed(interaction.message.embeds[1]).setURL(url),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the url to: \n**${url}**`.slice(0, 2000))],
      });
    }
  },
};
