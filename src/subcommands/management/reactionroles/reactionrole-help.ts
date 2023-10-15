const { ChatInputCommandInteraction, Client } = require('discord.js');
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'reactionroles',
  name: 'help',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle('What is the reactionroles module and how do I use it?')
          .setDescription(
            'Reactionroles are an easy way for users in the server to collect roles, simply by clicking on the reaction of the message. Some roles require certain permissions and some others have specific settings. Staff members are the only ones who can create, delete and manage reactionroles.',
          ),
      ],
    });
  },
};
