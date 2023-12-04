import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  type EmbedAuthorData,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  Colors,
} from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { fixEmbed, prepareEmbed } from '@functions/discord';

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
            .setRequired(false)
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
            .setRequired(false)
            .setPlaceholder('Insert your favorite author icon here...'),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('url')
            .setLabel('Author Url')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.author?.url ?? '')

            .setMaxLength(250)
            .setRequired(false)
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

      if (!isValidHttpUrl(url)) url = null;
      if (!isValidHttpUrl(icon)) icon = null;

      let author: EmbedAuthorData | null = { name: text };
      if (icon) author.iconURL = icon;
      if (url) author.url = url;

      if (!text) {
        const reply = await modal.editReply({
          embeds: [
            new Embed(Colors.Red).setDescription(
              'The author gets removed when the "text" field is empty!\nClick on continue to remove (automatically cancels in 10s).',
            ),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().setComponents(
              new ButtonBuilder().setCustomId('continue').setStyle(ButtonStyle.Success).setLabel('Continue'),
              new ButtonBuilder().setCustomId('cancel').setStyle(ButtonStyle.Danger).setLabel('Cancel'),
            ),
          ],
        });

        const collector = reply.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 10 * 1000,
          max: 1,
        });

        collector.once('collect', async i => {
          if (i.customId === 'cancel') {
            await i.update({
              embeds: [
                new Embed(color).setDescription(
                  "Canceled the removal of the author.\nReason: \"Pressed the 'cancel' button'",
                ),
              ],
              components: [],
            });
            return;
          }
          if (i.customId === 'continue') {
            await interaction.message.edit({
              embeds: [
                EmbedBuilder.from(interaction.message.embeds[0]),
                fixEmbed(prepareEmbed(interaction.message.embeds[1]).setAuthor(null)),
              ],
            });

            await i.update({
              embeds: [new Embed(color).setDescription('The author has been removed.')],
              components: [],
            });
            return;
          }
        });

        collector.once('end', async collected => {
          if (collected.size < 1) {
            await reply.edit({
              embeds: [
                new Embed(color).setDescription(
                  'Canceled the removal of the author.\nReason: "Didn\'t respond in 10s"',
                ),
              ],
              components: [],
            });
          }
        });
      } else {
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
    }
  },
};
