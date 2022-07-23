const { ApplicationCommandOptionType, INteraction } = require('discord.js');

module.exports = {
    name: "games",
    description: "Play games.",
    options: [
        {
            name: "brokegamble",
            description: 'Gamble, but without money.',
            options: [
                {
                    name: "private",
                    description: "Should QuaBot announce the result?",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "coin",
            description: "Flip a coin",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "rps",
            description: "Play a game of Rock, Paper, Scissors.",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        // This file only creates the options.
        
    }
}
