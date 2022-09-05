const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "applications",
    description: "Manage applications.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "manage",
            description: "Create, delete and edit applications.",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "list",
            description: "List all applications.",
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async execute() { }
}