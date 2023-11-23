import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Manage your afk status.')
    .addSubcommand(command =>
      command
        .setName('toggle')
        .setDescription('Set your AFK to enabled/disabled.')
        .addBooleanOption(option =>
          option.setName('enabled').setDescription('Should the AFK module be enabled/disabled.'),
        ),
    )
    .addSubcommand(command => command.setName('status').setDescription('Set your AFK status.'))
    .addSubcommand(command => command.setName('list').setDescription('See a list of AFK users in the server.'))
    .addSubcommand(command => command.setName('help').setDescription('Get some information about the afk module.'))
    .setDMPermission(false),

  async execute() {},
};
