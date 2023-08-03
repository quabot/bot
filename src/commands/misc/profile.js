const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No executed code since it just creates slash subcommands.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('View a user\'s profile.')
        .addSubcommand(subcommand => subcommand
            .setName('view')
            .setDescription('View a user\'s profile.')
            .addUserOption(option => option
                .setName('user')
                .setDescription('The user to view the profile of.')
                .setRequired(false)))
        .addSubcommand(subcommand => subcommand
            .setName('bio')
            .setDescription('Set your profile bio.'))
        .addSubcommand(subcommand => subcommand
            .setName('birthday')
            .setDescription('Set your birthday.')
            .addNumberOption(option => option
                .setName('day')
                .setDescription('Day of your birthday')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('month')
                .setDescription('Month of your birthday')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('year')
                .setDescription('Year of your birthday')
                .setRequired(true)))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}