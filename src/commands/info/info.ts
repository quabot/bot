import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about the server, users, roles, channels and QuaBot.')
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand.setName('bot').setDescription('Get information about QuaBot.'))
        .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get information about the server.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Get information about a channel.')
                .addChannelOption(option =>
                    option.setName('channel').setDescription('The channel to get information about.').setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get information about a user.')
                .addUserOption(option =>
                    option.setName('user').setDescription('The user to get information about.').setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('role')
                .setDescription('Get information about a role.')
                .addRoleOption(option =>
                    option.setName('role').setDescription('The role to get information about.').setRequired(true)
                )
        ),
    async execute() {},
};
