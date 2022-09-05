const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "level",
    description: 'View levels.  ',
    permissions: [PermissionFlagsBits.SendMessages],
    options: [
        {
            name: "view",
            description: "View someone's current level.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "user",
                    type: ApplicationCommandOptionType.User,
                    required: false,
                    description: "User to view the levels of."
                }
            ]
        },
        {
            name: "leaderboard",
            description: "View the server leaderboard.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "sortby",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    description: "Item to sort the leaderboard by.",
                    choices: [
                        { name: "xp", value: "xp" },
                        { name: "level", value: "level" }
                    ]
                }
            ]
        }
    ],
    async execute(client, interaction, color) { }
}
