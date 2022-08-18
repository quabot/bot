const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "reddit",
    description: "Get images from any subreddit.",
    options: [
        {
            name: "cat",
            description: "Get a cat image.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "dog",
            description: "Get a dog image",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "meme",
            description: "Get a random meme.",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "subreddit",
            description: "Get an image from a subreddit.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reddit",
                    description: "The subreddit to look through.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ],
    async execute() { }
}