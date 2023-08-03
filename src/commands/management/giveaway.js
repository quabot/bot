const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create, edit, reroll and end giveaways.')
        
        .addSubcommand(command => command
            .setName('create')
            .setDescription('Create a giveaway.')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the giveaway should be in.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('prize')
                .setDescription('The prize for winning the giveaway.')
                .setRequired(true))
            .addNumberOption(option => option
                .setName('winners')
                .setDescription('The amount of winners for the giveaway.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('duration')
                .setDescription('The length that the giveaway should last for.')
                .setRequired(true)))

        .addSubcommand(command => command
            .setName('reroll')
            .setDescription('Re-roll a giveaway.')
            .addNumberOption(option => option
                .setName('giveaway-id')
                .setDescription('The id of the giveaway to re-roll.')
                .setRequired(true)))

        .addSubcommand(command => command
            .setName('end')
            .setDescription('End a giveaway.')
            .addNumberOption(option => option
                .setName('giveaway-id')
                .setDescription('The id of the giveaway to end.')
                .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}