const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the server or user icon.')
        .addSubcommand(subcommand => subcommand
            .setName('server')
            .setDescription('Get the icon of the server.'))
        .addSubcommand(subcommand => subcommand
            .setName('user')
            .setDescription('Get a user\'s avatar.')
            .addUserOption(option => option
                .setName('user')
                .setRequired(false)
                .setDescription('The user to get the avatar of.'))
        )
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}