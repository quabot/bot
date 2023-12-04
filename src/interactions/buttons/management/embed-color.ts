import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';

export default {
  name: 'embed-color',

  async execute({ interaction, color }: ButtonArgs) {
    const mainModal = new ModalBuilder()
      .setCustomId('embed-color-modal')
      .setTitle('Embed Color')
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId('color')
            .setLabel('New color')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(500)
            .setPlaceholder('#fffff'),
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
      if (modal.customId !== 'embed-color-modal') return;

      await modal.deferReply({ ephemeral: true }).catch(() => {});
      const enteredColor = modal.fields.getTextInputValue('color');
      if (!enteredColor) {
        await interaction.message.edit({
          embeds: [
            EmbedBuilder.from(interaction.message.embeds[0]),
            EmbedBuilder.from(interaction.message.embeds[1]).setColor(color),
          ],
        });

        await modal.editReply({
          embeds: [new Embed(color).setDescription(`Set the color to the server default: \n**${color}**`)],
        });
        return;
      }

      if (!/^#([0-9A-F]{6}){1,2}$/i.test(enteredColor) || !enteredColor.startsWith('#'))
        return await modal.editReply({
          embeds: [new Embed(color).setDescription('No valid color entered, try again.')],
        });

      await interaction.message.edit({
        embeds: [
          EmbedBuilder.from(interaction.message.embeds[0]),
          EmbedBuilder.from(interaction.message.embeds[1]).setColor(enteredColor as `#${string}`),
        ],
      });

      await modal.editReply({
        embeds: [new Embed(color).setDescription(`Set the color to: \n**${enteredColor}**`.slice(0, 2000))],
      });
    }
  },
};
