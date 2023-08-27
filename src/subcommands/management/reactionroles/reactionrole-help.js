const { ChatInputCommandInteraction, Client } = require('discord.js');
const { Embed } = require('@constants/embed');

module.exports = {
  parent: 'reactionroles',
  name: 'help',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {import("discord.js").ColorResolvable} color
   */
  async execute(client, interaction, color) {
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
