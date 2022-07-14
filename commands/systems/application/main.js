const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager } = require('discord.js');

module.exports = {
    name: "application",
    description: 'Staff applications.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "list",
            description: "List all applications.",
            type: "SUB_COMMAND",
        },
        {
            name: 'responses',
            description: "List all responses for an application. You can also do this on our dashboard.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "application_id",
                    description: "Application text ID.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "response_user",
                    description: "The whose response you want to approve.",
                    type: "USER",
                    required: false
                }
            ]
        }
    ],
    async execute(client, interaction, color) {}
}