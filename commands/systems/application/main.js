const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionOverwrites, Permissions, Message, MessageManager, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "application",
    description: 'Staff applications.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "list",
            description: "List all applications.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'responses',
            description: "List all responses for an application. You can also do this on our dashboard.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "application_id",
                    description: "Application text ID.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "response_user",
                    description: "The whose response you want to approve.",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        }
    ],
    async execute(client, interaction, color) {}
}