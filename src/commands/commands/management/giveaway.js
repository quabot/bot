const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "giveaway",
    description: "Create a giveaway.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "create",
            description: "Create a giveaway.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Channel to create the giveaway in.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                },
                {
                    name: "prize",
                    description: "The prize users can win",
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    name: "winners",
                    description: "How many people can win.",
                    required: true,
                    type: ApplicationCommandOptionType.Integer
                },
                {
                    name: "duration",
                    description: "When the giveaway will end. (1h, 10min)",
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
        },
        {
            name: "reroll",
            description: "Re-roll a giveaway.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "The id of the giveaway to reroll.",
                    required: true,
                    type: ApplicationCommandOptionType.Integer
                }
            ]
        },
        {
            name: "end",
            description: "End a giveaway early.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "id",
                    description: "The id of the giveaway to end.",
                    required: true,
                    type: ApplicationCommandOptionType.Integer
                }
            ]
        },
    ],
    async execute() { }
}