const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Create tickets.')
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Create a ticket.')
            .addStringOption(option => option
                .setName('topic')
                .setRequired(true)
                .setDescription('The ticket topic.')))
        .addSubcommand(subcommand => subcommand
            .setName('claim')
            .setDescription('Claim a ticket.'))
        .addSubcommand(subcommand => subcommand
            .setName('close')
            .setDescription('Close a ticket.'))
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a ticket.'))
        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a user to the ticket.')
            .addUserOption(option => option
                .setName('user')
                .setRequired(true)
                .setDescription('The user to add to the ticket.')))
        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove a user from the ticket.')
            .addUserOption(option => option
                .setName('user')
                .setRequired(true)
                .setDescription('The user to remove from the ticket.')))
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}