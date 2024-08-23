import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a user message or user.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('message')
        .setDescription('Report a message.')
        .addStringOption(option =>
          option.setName('message-url').setDescription('The url of the message you wish to report.').setRequired(true),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Report a user.')
        .addUserOption(option => option.setName('user').setDescription('The user you wish to report.').setRequired(true)),
    )
    .setDMPermission(false),

  async execute() {},
};
