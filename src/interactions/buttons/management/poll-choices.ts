import type { ButtonArgs } from '@typings/functionArgs';
import Poll from '@schemas/Poll';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getIdConfig } from '@configs/idConfig';
import { Embed } from '@constants/embed';
import type { PollData } from '@typings/poll';

export default {
  name: 'choices-poll',

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
    const options = document?.options ?? [];

    const modal = new ModalBuilder().setTitle('Configure Poll').setCustomId('choices-poll');

    for (let index = 0; index < choices; index++)
      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().setComponents(
          new TextInputBuilder()
            .setCustomId(`${index}`)
            .setLabel(`Option ${index + 1}`)
            .setRequired(true)
            .setMaxLength(180)
            .setValue(document ? `${options[index] ? options[index] : ''}` : '')
            .setStyle(TextInputStyle.Short),
        ),
      );

    await interaction.showModal(modal);

    if (document) return;

    const newPoll = new Poll({
      guildId: interaction.guildId,
      id: ids.pollId,
      channel: channel,
      message: 'none',
      interaction: interaction.message.id,
      role: role,

      topic: 'none',
      description: 'none',

      duration: duration,
      optionsCount: choices,
      options: [],

      created: 0,
      endTimestamp: 0,
    });
    await newPoll.save();
  },
};
