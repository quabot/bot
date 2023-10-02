import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('channel')
    .setDescription('Manage channels.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a channel.')
        .addStringOption(option => option.setDescription('The channel name.').setRequired(true).setName('name'))
        .addStringOption(option => option.setDescription('The channel topic.').setRequired(false).setName('topic'))
        .addBooleanOption(option =>
          option.setDescription('Should the channel be marked as NSFW?').setRequired(false).setName('nsfw'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a channel.')
        .addChannelOption(option =>
          option.setDescription('The channel to remove.').setRequired(true).setName('channel'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('slowmode')
        .setDescription("Set a channel's slowmode.")
        .addChannelOption(option =>
          option.setDescription('The channel to set the slowmode of.').setRequired(true).setName('channel'),
        )
        .addStringOption(option =>
          option
            .setDescription('The slowmode to set it to (format: 1h, 20min, 30s).')
            .setRequired(true)
            .setName('slowmode'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a channel.')
        .addChannelOption(option => option.setDescription('The channel to edit.').setRequired(true).setName('channel'))
        .addStringOption(option => option.setDescription('The new channel name.').setRequired(false).setName('name'))
        .addStringOption(option => option.setDescription('The new channel topic.').setRequired(false).setName('topic')),
    ),

  async execute() {
    //* This command is just a placeholder for the subcommands.
  },
};
