const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get information about users, channels and much more.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('bot')
                .setDescription('Get information about QuaBot.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Get information about a channel.')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to get info about.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('Get information about the server.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about a user.')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to get info about.')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Get information about a role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to get info about.')
                        .setRequired(true))),
    async execute() { }
}