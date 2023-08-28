const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');
const axios = require('axios');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('wyr')
    .setDescription('Get a would you rather dillema.')
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Get the would you rather from the API and return an error if it fails.
    const { data: wyr } = await axios.get('https://would-you-rather-api.abaanshanid.repl.co');
    if (!wyr)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Failed to get a would you rather!')],
      });

    //* Edit the message to show the would you rather to the user.
    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`${wyr.data}`)],
    });
  },
};
