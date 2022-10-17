const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Send messages to create tickets, suggestions or to verify.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild
        )
        .addSubcommand(subcommand => subcommand.setName('verification').setDescription('Send a verification message.'))
        .addSubcommand(subcommand => subcommand.setName('tickets').setDescription('Send a tickets message.'))
        .addSubcommand(subcommand => subcommand.setName('suggestions').setDescription('Send a suggestions message.')),
    async execute() {},
};
