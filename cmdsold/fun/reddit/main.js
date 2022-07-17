module.exports = {
    name: "reddit",
    description: "Browse reddit.",
    options: [
        {
            name: "meme",
            description: "Get a meme",
            type: "SUB_COMMAND"
        },
        {
            name: "subreddit",
            description: "Get images from a subreddit.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "reddit",
                    description: "The subreddit to get the images of.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
    ],
    async execute(client, interaction, color) {

        // This file only creates the options.
        
    }
}