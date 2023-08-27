const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Get the latency between QuaBot and the Discord API.')
    .setDMPermission(false),
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(client, interaction, color) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`🏓 **${client.ws.ping}ms**`)],
    });
  },
};
