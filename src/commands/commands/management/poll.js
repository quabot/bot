const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "poll",
    description: "Create polls.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "create",
            description: "Create a poll.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Channel to send the poll in.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                },
                {
                    name: "choices",
                    description: "Amount of poll choices.",
                    required: true,
                    type: ApplicationCommandOptionType.Integer,
                    choices: [
                        { name: "2", value: 2 },
                        { name: "3", value: 3 },
                        { name: "4", value: 4 },
                    ]
                },
                {
                    name: "duration",
                    description: "How long the poll should last (1h, 30min).",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "end",
            description: "End a currently active poll.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "Poll-id to end.",
                    type: ApplicationCommandOptionType.Integer,
                    required: true
                }
            ]
        }
    ],
    async execute() { }
}