module.exports = {
    name: "level",
    description: "Level Module",
    options: [
        {
            name: "view",
            description: "View yours or someone else's XP & Level.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "user",
                    description: "User to find.",
                    required: false,
                    type: "USER",
                }
            ]
        },
        {
            name: "leaderboard",
            description: "Get the top 15 users.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "type",
                    description: "Sort by XP or Level.",
                    required: true,
                    type: "STRING",
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
