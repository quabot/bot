import {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  type EmbedFooterData,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from 'discord.js';
import { Embed } from '@constants/embed';
import { isValidHttpUrl } from '@functions/string';
import type { ButtonArgs } from '@typings/functionArgs';
import { fixEmbed, prepareEmbed } from '@functions/discord';

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
            .setRequired(false)
            .setMaxLength(2048)
            .setPlaceholder('My footer text...'),
        ),
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('icon')
            .setLabel('Footer Icon')
            .setStyle(TextInputStyle.Paragraph)
            .setValue(interaction.message.embeds[1].data.footer?.icon_url ?? '')
            .setRequired(false)
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

      if (!text) {
        const reply = await modal.editReply({
          embeds: [
            new Embed(Colors.Red).setDescription(
              'The footer gets removed when the "text" field is empty!\nClick on continue to remove (automatically cancels in 10s).',
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
                  "Canceled the removal of the footer.\nReason: \"Pressed the 'cancel' button'",
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
                fixEmbed(prepareEmbed(interaction.message.embeds[1]).setFooter(null)),
              ],
            });

            await i.update({
              embeds: [new Embed(color).setDescription('The footer has been removed.')],
              components: [],
            });
            return;
          }
        });

        collector.once('end', async collected => {
          if (collected.size < 1) {
            await reply
              .edit({
                embeds: [
                  new Embed(color).setDescription(
                    'Canceled the removal of the footer.\nReason: "Didn\'t respond in 10s"',
                  ),
                ],
                components: [],
              })
              .catch(() => null);
          }
        });
        return;
      }

      if (!isValidHttpUrl(url)) url = null;

      const footer: EmbedFooterData = { text };
      if (url) footer.iconURL = url;

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          prepareEmbed(interaction.message.embeds[1]).setFooter(footer),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription('Changed the footer!')],
      });
    }
  },
};
