const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: "reactionroles",
    description: "Create, edit and list reactionroles.",
    permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "create",
            description: "Create reactionroles.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Channel where the message is located.",
                    type: ApplicationCommandOptionType.Channel,
                    required: true,
                },
                {
                    name: "message",
                    description: "Message id of the message.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "role",
                    description: "Role to use.",
                    type: ApplicationCommandOptionType.Role,
                    required: true,
                },
                {
                    name: "emoji",
                    description: "Emoji to use.",
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "permission",
                    description: "Required permission for this reactionrole.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                    choices: [
                        { name: "Create Instant Invite", value: "CREATE_INSTANT_INVITE" },
                        { name: "Kick Members", value: "KICK_MEMBERS" },
                        { name: "Ban Members", value: "BAN_MEMBERS" },
                        { name: "Timeout Members", value: "MODERATE_MEMBERS" },
                        { name: "Administrator", value: "ADMINISTRATOR" },
                        { name: "Manage Channels", value: "MANAGE_CHANNELS" },
                        { name: "Manage Server", value: "MANAGE_GUILD" },
                        { name: "Add Reactions", value: "ADD_REACTIONS" },
                        { name: "View Channel", value: "VIEW_CHANNEL" },
                        { name: "Send Messages", value: "SEND_MESSAGES" },
                        { name: "Manage Messages", value: "MANAGE_MESSAGES" },
                        { name: "Attach Files", value: "ATTACH_FILES" },
                        { name: "Read Message History", value: "READ_MESSAGE_HISTORY" },
                        { name: "Mention Everyone", value: "MENTION_EVERYONE" },
                        { name: "Use External Emojis", value: "USE_EXTERNAL_EMOJIS" },
                        { name: "Connect", value: "CONNECT" },
                        { name: "Speak", value: "SPEAK" },
                        { name: "Mute Members", value: "MUTE_MEMBERS" },
                        { name: "Deafen Members", value: "DEAFEN_MEMBERS" },
                        { name: "Move Members", value: "MOVE_MEMBERS" },
                        { name: "Change Nickname", value: "CHANGE_NICKNAME" },
                        { name: "Manage Nicknames", value: "MANAGE_NICKNAMES" },
                        { name: "Manage Roles", value: "MANAGE_ROLES" },
                        { name: "Use Application Commands", value: "USE_APPLICATION_COMMANDS" },
                        { name: "Manage Threads", value: "MANAGE_THREADS" }
                    ],
                },
                {
                    name: "mode",
                    description: "Reactionrole mode (default = normal).",
                    type: ApplicationCommandOptionType.String,
                    choices: [
                        { name: "Normal", value: "normal" },
                        { name: "Verify", value: "verify" },
                        { name: "Drop", value: "drop" },
                        { name: "Reversed", value: "reversed" },
                        { name: "Unique", value: "unique" },
                        { name: "Binding", value: "binding" },
                    ],
                    required: false,
                }
            ]
        },
        {
            name: "delete",
            description: "Delete a reactionrole.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "message_id",
                    description: "The message to remove the reactionrole of.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "role",
                    description: "The role to remove.",
                    type: ApplicationCommandOptionType.Role,
                    required: true
                },
                {
                    name: "emoji",
                    description: "Emoji to remove.",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "List all reactionroles.",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "message_id",
                    description: "The message to list the reactionroles for.",
                    type: ApplicationCommandOptionType.String,
                    required: false
                },
                {
                    name: "role",
                    description: "The role to list the reactionroles for.",
                    type: ApplicationCommandOptionType.Role,
                    required: false
                },
                {
                    name: "channel",
                    description: "The channel to list the reactionroles for.",
                    type: ApplicationCommandOptionType.Channel,
                    required: false
                }
            ]
        }
    ],
    async execute(client, interaction, color) {}
}
