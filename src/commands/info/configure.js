const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('configure')
    .setDescription("Configure QuaBot's settings.")
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `In order to configure QuaBot's settings, visit the [QuaBot Dashboard](https://quabot.net/dashboard/${interaction.guildId}/general).`,
        ),
      ],
    });
  },
};
