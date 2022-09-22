const { ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('Create a giveaway.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a giveaway.')
                .addChannelOption(option => option.setDescription("Channel to create the giveaway in.").setRequired(true).setName("channel"))
                .addStringOption(option => option.setDescription("The prize users can win.").setRequired(true).setName("prize"))
                .addIntegerOption(option => option.setDescription("How many people can win.").setRequired(true).setName("winners"))
                .addStringOption(option => option.setDescription("When the giveaway will end. (1h, 10min)").setRequired(true).setName("duration")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('reroll')
                .setDescription('Re-roll a giveaway.')
                .addIntegerOption(option => option.setDescription("The id of the giveaway to reroll.").setRequired(true).setName("id")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End a giveaway.')
                .addIntegerOption(option => option.setDescription("The id of the giveaway to end.").setRequired(true).setName("id"))),
    async execute() { }
}