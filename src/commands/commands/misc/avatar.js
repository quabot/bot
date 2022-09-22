const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the user or server icon/avatar.')
        .setDMPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get a user avatar.')
                .addUserOption(option => option.setName("user").setRequired(false).setDescription("The user to get the avatar of.")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('server')
                .setDescription('List all applications.')),
    async execute() { }
}