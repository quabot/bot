const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager } = require('discord.js');

module.exports = {
    name: "application",
    description: 'Staff applications.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "list",
            description: "List all applications",
            type: "SUB_COMMAND",
        },
        {
            name: 'answers',
            description: "List all responses for an application",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "application_id",
                    description: "Application text ID",
                    type: "STRING",
                    required: true
                },
                {
                    name: "response_user",
                    description: "The whose response you want to approve",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "approve",
            description: "Approve a staff application",
            type: "SUB_COMMAND",
        },
        {
            name: "deny",
            description: "Deny a staff application",
            type: "SUB_COMMAND",
        }
    ],
    async execute(client, interaction, color) {

        // only 4 subcommands
        
    }
}