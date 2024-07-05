import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('View the levels and leaderboards.')
    .addSubcommand(command =>
      command
        .setName('view')
        .setDescription("View someone's current XP and level.")
        .addUserOption(option => option.setName('user').setDescription('The user to view the XP of.')),
    )
    .addSubcommand(command => command.setName('leaderboard').setDescription('View the server XP leaderboard.'))
    .addSubcommand(command => command.setName('help').setDescription('View some information about the levels module.'))
    .addSubcommand(command =>
      command
        .setName('set')
        .addUserOption(option => option.setName('user').setDescription('The user to set the XP of.').setRequired(true))
        .addNumberOption(option => option.setName('level').setDescription('The level value to set it to.'))
        .addNumberOption(option => option.setName('xp').setDescription('The XP value to set it to.'))
        .setDescription("Set a user's XP or level."),
    )
    .addSubcommand(command =>
      command
        .setName('reset')
        .setDescription("Reset a user's XP and level.")
        .addUserOption(option =>
          option.setName('user').setDescription('The user to reset the XP of.').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command
        .setName('reset-old-members')
        .setDescription('Force-reset the XP and levels from the users that have left the server.'),
    )
    .setDMPermission(false),

  async execute() {},
};
