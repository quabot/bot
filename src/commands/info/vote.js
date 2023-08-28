const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');
const { Embed } = require('@constants/embed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Get the URL to vote for QuaBot.')
    .setDMPermission(false),
  
  async execute({ client, interaction, color }: CommandArgs) {
    //* Defer the reply to give the user an instant response.
    await interaction.deferReply();

    //* Send the response to the user.
    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setThumbnail(`${client.user.avatarURL()}`)
          .setTitle('QuaBot Voting')
          .setDescription(
            'You can vote for QuaBot [here](https://top.gg/bot/995243562134409296)! You will receive a 1.5x level multiplier and be listed in our [support server](https://discord.quabot.net).',
          ),
      ],
    });
  },
};
