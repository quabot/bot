const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('punishments')
        .setDescription('Manage punishments.')
        .addSubcommand(command => command.setName("find").setDescription("Find and list punishments.")
            .addStringOption(option => option.setName("punishment").setRequired(false).setDescription("The punishment to view.").addChoices([
                { name: "Kick", value: "kick" },
                { name: "Ban", value: "ban" },
                { name: "Tempban", value: "tempban" },
                { name: "Timeout", value: "timeout" },
                { name: "Warn", value: "warn" }
            ]))
            .addUserOption(option => option.setName("user").setDescription("The user to view.").setRequired(false))
            .addUserOption(option => option.setName("staff-member").setDescription("The staff member that executed the infractions.").setRequired(false)))
        .addSubcommand(command => command.setName("punishments").setDescription("Manage punishments."))
        .setDMPermission(false),
    async execute(client, interaction, color) { }
}