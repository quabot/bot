const { EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "moderate",
    description: "Manage punishments.",
    permission: "MODERATE_MEMBERS",
    options: [
        {
            name: "find",
            description: "Find and list punishments.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "punishment",
                    description: "The punishment to view.",
                    type: "STRING",
                    required: false,
                    choices: [
                        { name: "Kick", value: "kick" },
                        { name: "Ban", value: "ban" },
                        { name: "Tempban", value: "tempban" },
                        { name: "Timeout", value: "timeout" },
                        { name: "Warn", value: "warn" }
                    ]
                },
                {
                    name: "user",
                    description: "The user to view.",
                    type: "USER",
                    required: false
                },
                {
                    name: "staff-member",
                    description: "The staff member that executed the infractions.",
                    type: "USER",
                    required: false
                }
            ]
        },
        {
            name: "manage",
            description: "Manage punishments.",
            type: "SUB_COMMAND",
        },
    ],
    async execute(client, interaction, color) {}
}
