const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create a ticket.')
        .addSubcommand(command =>
            command
                .setName('create')
                .setDescription('Create a ticket.')
                .addStringOption(option =>
                    option.setName('topic').setRequired(false).setDescription('The ticket topic.')
                )
        )
        .addSubcommand(command => command.setName('close').setDescription('Close a ticket.'))
        .addSubcommand(command => command.setName('delete').setDescription('Delete a ticket.'))
        .addSubcommand(command =>
            command
                .setName('add')
                .setDescription('Add a user to a ticket.')
                .addUserOption(option => option.setName('user').setRequired(true).setDescription('The user to add.'))
        )
        .addSubcommand(command =>
            command
                .setName('remove')
                .setDescription('Remove a user from a ticket.')
                .addUserOption(option => option.setName('user').setRequired(true).setDescription('The user to remove.'))
        )
        .setDMPermission(false),
    async execute(client, interaction, color) {},
};
