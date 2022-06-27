module.exports = {
    name: "games",
    description: "Play games",
    options: [
        {
            name: "brokegamble",
            description: 'Gamble, but without money.',
            options: [
                {
                    name: "private",
                    description: "Should QuaBot announce the result?",
                    type: "BOOLEAN",
                    required: false,
                }
            ],
            type: "SUB_COMMAND"
        },
        {
            name: "coin",
            description: "Flip a coin",
            type: "SUB_COMMAND",
        },
        {
            name: "rps",
            description: "Play a game of Rock, Paper, Scissors.",
            type: "SUB_COMMAND",
        },
    ],
    async execute(client, interaction, color) {

        // This file only creates the options.
        
    }
}