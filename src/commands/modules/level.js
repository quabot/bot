const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('View the levels and leaderboards.')
        .addSubcommand(command => command
            .setName('view')
            .setDescription('View someone\'s current XP and level.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to view the XP of.')
                .setRequired(false)))
        .addSubcommand(command => command
            .setName('leaderboard')
            .setDescription('View the server XP leaderboard.'))
        .addSubcommand(command => command
            .setName('help')
            .setDescription('View some information about the levels module.'))
        .addSubcommand(command => command
            .setName('set')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to set the XP of.')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('level')
                .setDescription('The level value to set it to.')
                .setRequired(false))
            .addNumberOption(option => option
                .setName('xp')
                .setDescription('The XP value to set it to.')
                .setRequired(false))
            .setDescription('Set a user\'s XP or level.'))
        .addSubcommand(command => command
            .setName('reset')
            .setDescription('Reset a user\'s XP and level.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to reset the XP of.')
                .setRequired(true)))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
    }
}