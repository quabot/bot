import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Create tickets.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a ticket.')
        .addStringOption(option => option.setName('topic').setRequired(true).setDescription('The ticket topic.')),
    )
    .addSubcommand(subcommand => subcommand.setName('claim').setDescription('Claim a ticket.'))
    .addSubcommand(subcommand =>
      subcommand.setName('unclaim').setDescription('Unclaim a ticket so someone else can claim it.'),
    )
    .addSubcommand(subcommand => subcommand.setName('info').setDescription('Receive some information about a ticket.'))
    .addSubcommand(subcommand => subcommand.setName('close').setDescription('Close a ticket.'))
    .addSubcommand(subcommand => subcommand.setName('transcript').setDescription('Get a ticket transcript.'))
    .addSubcommand(subcommand => subcommand.setName('reopen').setDescription('Reopen a ticket.'))
    .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete a ticket.'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('rename')
        .setDescription('Change the ticket topic.')
        .addStringOption(option =>
          option.setName('new-topic').setRequired(true).setDescription('The new ticket topic.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a user to the ticket.')
        .addUserOption(option =>
          option.setName('user').setRequired(true).setDescription('The user to add to the ticket.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('add-role')
        .setDescription('Add a role to the ticket.')
        .addRoleOption(option =>
          option.setName('role').setRequired(true).setDescription('The role to add to the ticket.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('transfer')
        .setDescription('Change ownership of the ticket.')
        .addUserOption(option =>
          option.setName('user').setRequired(true).setDescription('The user to make the ticket owner.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand.setName('help').setDescription('Show some general information about tickets.'),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a user from the ticket.')
        .addUserOption(option =>
          option.setName('user').setRequired(true).setDescription('The user to remove from the ticket.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove-role')
        .setDescription('Remove a role from the ticket.')
        .addRoleOption(option =>
          option.setName('role').setRequired(true).setDescription('The role to from to the ticket.'),
        ),
    )
    .setDMPermission(false),

  async execute() {},
};
