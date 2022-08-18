const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "info",
    description: "Get information about users, channels and much more.",
    options: [
        {
            name: "bot",
            description: "Get information about QuaBot.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "channel",
            description: "Get information about a channel.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "The channel to get info about.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        },
        {
            name: "server",
            description: "Get information about the server.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "user",
            description: "Get information about a user.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user to get info about.",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "role",
            description: "Get information about a role.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "role",
                    description: "The role to get info about.",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        }
    ],
    async execute() { }
}