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
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
    }
}