import { SlashCommandBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import axios from 'axios';
import type { CommandArgs } from '@typings/functionArgs';
import { getRandomItemFromArray } from '@functions/array';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('wyr')
    .setDescription('Get a would you rather dillema.')
    .setDMPermission(false),

  async execute({ interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Get the would you rather from the API and return an error if it fails.
    const {
      data: {
        data: { all: data },
      },
    } = await axios.get('https://randomwordgenerator.com/json/question-would-you-rather.json');

    const wyr = getRandomItemFromArray(data as { question_would_you_rather: string }[]);
    if (!wyr)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to get a would you rather!')],
      });

    //* Edit the message to show the would you rather to the user.
    await interaction.editReply({
      embeds: [new Embed(color).setDescription(wyr.question_would_you_rather)],
    });
  },
};
