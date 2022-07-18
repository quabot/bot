const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
    name: "reddit",
    description: "Browse reddit.",
    options: [
        {
            name: "meme",
            description: "Get a meme",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "subreddit",
            description: "Get images from a subreddit.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reddit",
                    description: "The subreddit to get the images of.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction, color) {

        // This file only creates the options.
        
    }
}