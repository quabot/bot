import { SlashCommandBuilder } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the server or user icon.')
    .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get the icon of the server.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription("Get a user's avatar.")
        .addUserOption(option => option.setName('user').setDescription('The user to get the avatar of.')),
    )
    .setDMPermission(false),

  async execute() {},
};
