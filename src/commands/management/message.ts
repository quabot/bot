import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('message')
    .setDescription('Send a message to a channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild,
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('send')
        .setDescription('Send a message.')
        .addChannelOption(option =>
          option.setDescription('Channel to send the message to.').setRequired(true).setName('channel'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a message.')
        .addStringOption(option =>
          option.setDescription('URL of the message to edit.').setRequired(true).setName('message'),
        ),
    ),

  async execute() {},
};
