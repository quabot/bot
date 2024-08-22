import { getSuggestConfig } from '@configs/suggestConfig';
import { Embed } from '@constants/embed';
import type { ButtonArgs } from '@typings/functionArgs';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';

export default {
  name: 'suggestion-create',

  async execute({ client, interaction, color }: ButtonArgs) {
    const config = await getSuggestConfig(client, interaction.guildId ?? '');
    if (!config)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            'We are setting up suggestions for first-time use, please run the command again.',
          ),
        ],
        ephemeral: true
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server.')],
        ephemeral: true
      });

    const channel = interaction.guild?.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription(
            'The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).',
          ),
        ],
      });

    const modal = new ModalBuilder()
      .setTitle('Leave a suggestion...')
      .setCustomId('suggest')
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('suggestion')
            .setLabel('Suggestion')
            .setMaxLength(800)
            .setMinLength(2)
            .setPlaceholder('Leave a suggestion...')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    await interaction.showModal(modal);
  },
};
