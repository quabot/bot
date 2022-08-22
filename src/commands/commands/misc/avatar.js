const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "avatar",
    description: "Get the user or server icon/avatar.",
    options: [
        {
            name: "user",
            description: "Get a user avatar.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "The user to get the avatar of.",
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: "server",
            description: "Get the server icon.",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async execute() { }
}