const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "punishments",
    description: "Manage punishments.",
    permission: PermissionFlagsBits.ModerateMembers,
    options: [
        {
            name: "find",
            description: "Find and list punishments.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "punishment",
                    description: "The punishment to view.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: "Kick", value: "kick" },
                        { name: "Ban", value: "ban" },
                        { name: "Tempban", value: "tempban" },
                        { name: "Timeout", value: "timeout" },
                        { name: "Warn", value: "warn" }
                    ]
                },
                {
                    name: "user",
                    description: "The user to view.",
                    type: ApplicationCommandOptionType.User,
                    required: false
                },
                {
                    name: "staff-member",
                    description: "The staff member that executed the infractions.",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "manage",
            description: "Manage punishments.",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async execute(client, interaction, color) {}
}