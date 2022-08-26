const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "message",
    description: "Send a message to a channel.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "embed",
            description: "Send a embed-message.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Channel to send to message to.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                }
            ],
        },
        {
            name: "text",
            description: "Send a text-message.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Channel to send to message to.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                }
            ],
        },
    ],
    async execute() { }
}