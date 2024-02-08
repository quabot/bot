import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('applications')
    .setDescription('Fill out and view forms.')
    .addSubcommand(command => command.setName('apply').setDescription('Apply for an application.'))
    .addSubcommand(command => command.setName('manage').setDescription('Manage server forms.'))
    .addSubcommand(command => command.setName('list').setDescription('See a list of forms in the server.'))
    .addSubcommand(command =>
      command.setName('help').setDescription('Get some information about the applications module.'),
    )
    .setDMPermission(false),

  async execute() {},
};
