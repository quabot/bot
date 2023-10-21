import { getIdConfig } from '@configs/idConfig';
import Poll from '@schemas/Poll';
import type { ButtonArgs } from '@typings/functionArgs';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { Embed } from '@constants/embed';
import type { PollData } from '@typings/poll';

export default {
  name: 'details-poll',

  async execute({ interaction, color, client }: ButtonArgs) {
    const pd = client.cache.get<PollData>(`polldata-${interaction.message.id}`);

    if (!pd)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription("The data of your poll can't be found, please create a new one.")],
        ephemeral: true,
      });

    const { channel, role, duration, choices } = pd;

    const ids = await getIdConfig(interaction.guildId!);
    if (!ids)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
        ephemeral: true,
      });

    const document = await Poll.findOne({
      guildId: interaction.guildId,
      interaction: interaction.message.id,
    });

    const modal = new ModalBuilder()
      .setTitle('Configure Poll')
      .setCustomId('info-poll')
      .setComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('question')
            .setPlaceholder('Poll Question...')
            .setLabel('Poll Question')
            .setMaxLength(256)
            .setValue(document ? (document.topic === 'none' ? '' : document.topic) : '')
            .setRequired(true)
            .setStyle(TextInputStyle.Short),
        ),
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId('description')
            .setPlaceholder('Poll description...')
            .setLabel('Poll Description')
            .setValue(document ? (document.description === 'none' ? '' : document.description) : '')
            .setMaxLength(250)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph),
        ),
      );

    await interaction.showModal(modal);

    if (document) return;

    const newPoll = new Poll({
      guildId: interaction.guildId!,
      id: ids.pollId,
      channel,
      message: 'none',
      interaction: interaction.message.id,
      role,

      topic: 'none',
      description: 'none',

      duration,
      optionsCount: choices,
      options: [],

      created: 0,
      endTimestamp: 0,
    });
    await newPoll.save();
  },
};
