const { PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create polls.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a poll.')
                .addChannelOption(option => option.setDescription("Channel to send the poll in.").setRequired(true).setName("channel"))
                .addIntegerOption(option => option.setDescription("Amount of poll choices.").setRequired(true).setName("choices")
                    .addChoices(
                        { name: "2", value: 2 },
                        { name: "3", value: 3 },
                        { name: "4", value: 4 },
                        { name: "5", value: 5 },
                    ))
                .addStringOption(option => option.setDescription("How long the poll should last. (1h, 30min)").setRequired(true).setName("duration")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('end')
                .setDescription('End a active poll.')
                .addIntegerOption(option => option.setDescription("The id of the poll to end.").setRequired(true).setName("id"))),
    async execute() { }
}