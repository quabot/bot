const { MessageEmbed, MessageActionRow, MessageButton, PermissionOverwrites, Permissions, Message, MessageManager } = require('discord.js');

module.exports = {
    name: "ticket",
    description: 'Ticket Module.',
    permissions: ["MANAGE_CHANNELS", "SEND_MESSAGES"],
    options: [
        {
            name: "create",
            description: "Create a ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "topic",
                    type: "STRING",
                    required: false,
                    description: "The ticket topic."
                }
            ]
        },
        {
            name: "close",
            description: "Close a ticket.",
            type: "SUB_COMMAND",
        },
        {
            name: "delete",
            description: "Delete a ticket.",
            type: "SUB_COMMAND",
        },
        {
            name: "add",
            description: "Add a user to the ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    type: "USER",
                    required: true,
                    description: "The user to add."
                },
            ],
        },
        {
            name: "remove",
            description: "Remove a user from the ticket.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    type: "USER",
                    required: true,
                    description: "The user to remove."
                },
            ],
        },
    ],
    async execute(client, interaction, color) {

        // only 4 subcommands
        
    }
}