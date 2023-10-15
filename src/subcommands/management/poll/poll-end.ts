const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require('discord.js');
import ms from 'ms';
const Poll = require('@schemas/Poll');
import { getIdConfig } from '@configs/idConfig';
import { getPollConfig } from '@configs/pollConfig';
import { Embed } from '@constants/embed';
const { endPoll } = require('@functions/poll');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'poll',
  name: 'end',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getPollConfig(client, interaction.guildId);
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Polls are not enabled in this server.')],
      });

    const id = interaction.options.getNumber('poll-id');

    if (id === undefined || id === null)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    const poll = await Poll.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!poll)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please give a valid poll-id.')],
      });

    await endPoll(client, poll);
  },
};
