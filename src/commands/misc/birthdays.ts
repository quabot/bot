import { SlashCommandBuilder } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('birthdays')
    .setDescription('View and manage birthdays.')
    .addSubcommand(subcommand => subcommand.setName('next').setDescription('View the next 10 birthdays of people in the server.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription("Set your birthday.")
        .addStringOption(option => option.setName('date').setDescription('The date of your birthday in the format DD/MM/YYYY.').setRequired(true)),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription("Remove your birthday."),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription("View your (or someone else's) birthday.")
        .addUserOption(option => option.setName('user').setDescription('The user to view the birthday of.')),
    )
    .setDMPermission(false),
  async execute() {},
};
