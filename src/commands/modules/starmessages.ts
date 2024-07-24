import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('star-messages')
    .setDescription('Send your favorite messages in a specific channel.')
    .addSubcommand(command => command.setName('help').setDescription('Get some information about the star messages module.'))
    .addSubcommand(command =>
      command
        .setName('add')
        .setDescription('Add a message to the star channel.')
        .addStringOption(option =>
          option.setName('message-url').setDescription('The URL of the message to add to the starboard.').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command
        .setName('remove')
        .setDescription('Remove a message from the star channel.')
        .addStringOption(option =>
          option.setName('message-url').setDescription('The URL of the message to remove (the star channel message).').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command
        .setName('stats')
        .setDescription('View your own or someone else\'s stats about the starboard.')
        .addUserOption(option =>
          option.setName('user').setDescription('The user to view the stats of.').setRequired(false),
        ),
    )
    .setDMPermission(false),

  async execute() {},
};
