const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('members')
    .setDescription('Get the amount of members in the server.')
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${interaction.guild.iconURL()}`)
          .setTitle(`${interaction.guild.name}`)
          .setDescription(`${interaction.guild.memberCount.toLocaleString()} members.`),
      ],
    });
  },
};
