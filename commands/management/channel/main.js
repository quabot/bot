const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "channel",
    description: "Manage Channels with QuaBot.",
    permission: PermissionFlagsBits.Administrator,
    permissions: [PermissionFlagsBits.ManageChannels],
    options: [
        {
            name: "create",
            description: "Create a channel.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "name",
                    description: "Channel name.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "category",
                    description: "Category to place the channel in.",
                    type: ApplicationCommandOptionType.Channel,
                    required: false
                },
                {
                    name: "description",
                    description: "Channel description.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: "slowmode",
                    description: "Channel slowmode.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: "nsfw",
                    description: "Channel NSFW enabled?",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false
                }
            ]
        },
        {
            name: "edit",
            description: "Edit a channel.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "The channel to edit.",
                    required: true,
                    type: ApplicationCommandOptionType.Channel
                },
                {
                    name: "name",
                    description: "The new channel name.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: "description",
                    description: "Channel description.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: "slowmode",
                    description: "Channel slowmode.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
            ]
        }
    ],
    async execute(client, interaction, color) { }
}
