const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Send a message to a channel.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageMessages | PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('embed')
                .setDescription('Send an embedded message.')
                .addChannelOption(option => option.setDescription("Channel to send to message to.").setRequired(true).setName("channel")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('text')
                .setDescription('Send a text message.')
                .addChannelOption(option => option.setDescription("Channel to send to message to.").setRequired(true).setName("channel"))),
    async execute() { }
}