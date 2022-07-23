const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "level",
    description: "View someone's level.",
    options: [
        {
            name: "view",
            description: "View yours or someone else's XP & Level.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    description: "User to find.",
                    required: false,
                    type: ApplicationCommandOptionType.User,
                }
            ]
        },
        {
            name: "leaderboard",
            description: "Get the top 15 users.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "type",
                    description: "Sort by XP or Level.",
                    required: true,
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "Xp", value: "xp" },
                        { name: "Level", value: "level" },
                    ]
                }
            ]
        }
    ],
    async execute() {}
}
