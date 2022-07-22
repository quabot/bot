const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "ticket",
    description: 'Ticket Module.',
    permissions: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages],
    options: [
        {
            name: "create",
            description: "Create a ticket.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "topic",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    description: "The ticket topic."
                }
            ]
        },
        {
            name: "close",
            description: "Close a ticket.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "delete",
            description: "Delete a ticket.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "add",
            description: "Add a user to the ticket.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                    description: "The user to add."
                },
            ],
        },
        {
            name: "remove",
            description: "Remove a user from the ticket.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    type: ApplicationCommandOptionType.User,
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
