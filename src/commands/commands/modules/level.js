const { ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('View levels.')
        .addSubcommand(command => command
            .setName("view")
            .setDescription("View someone's current level.")
            .addUserOption(option => option.setRequired(false).setName("user").setDescription("User to view the levels of.")))
        .addSubcommand(command => command
            .setName("leaderboard")
            .setDescription("View the server leaderboard.")
            .addStringOption(option => option.setRequired(true).setName("sortby").setDescription("Type to sort the leaderboard by.").addChoices([
                { name: "xp", value: "xp" },
                { name: "level", value: "level" }
            ])))
        .setDMPermission(false),
    async execute(client, interaction, color) { }
}
