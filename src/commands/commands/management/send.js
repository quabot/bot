const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "send",
    description: "Send messages to create tickets, suggestions or to verify.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "verification",
            description: "Send a verification message.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "tickets",
            description: "Send a tickets message.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "suggestions",
            description: "Send a suggestions message.",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async execute() { }
}