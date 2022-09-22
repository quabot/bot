const { ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('applications')
        .setDescription('Manage applications.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('manage')
                .setDescription('Create, delete and edit applications.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all applications.')),
    async execute() { }
}