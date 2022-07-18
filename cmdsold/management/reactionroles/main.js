const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message } = require('discord.js');

module.exports = {
    name: "reactionroles",
    description: "Create, edit and list reactionroles.",
    permission: "ADMINISTRATOR",
    options: [
        {
            name: "create",
            description: "Create reactionroles.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Channel where the message is located.",
                    type: "CHANNEL",
                    required: true,
                },
                {
                    name: "message",
                    description: "Message id of the message.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "role",
                    description: "Role to use.",
                    type: "ROLE",
                    required: true,
                },
                {
                    name: "emoji",
                    description: "Emoji to use.",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "permission",
                    description: "Required permission for this reactionrole.",
                    type: "STRING",
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
                    type: "STRING",
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
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message_id",
                    description: "The message to remove the reactionrole of.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "role",
                    description: "The role to remove.",
                    type: "ROLE",
                    required: true
                },
                {
                    name: "emoji",
                    description: "Emoji to remove.",
                    type: "STRING",
                    required: true
                }
            ]
        },
        {
            name: "list",
            description: "List all reactionroles.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "message_id",
                    description: "The message to list the reactionroles for.",
                    type: "STRING",
                    required: false
                },
                {
                    name: "role",
                    description: "The role to list the reactionroles for.",
                    type: "ROLE",
                    required: false
                },
                {
                    name: "channel",
                    description: "The channel to list the reactionroles for.",
                    type: "CHANNEL",
                    required: false
                }
            ]
        }
    ],
    async execute(client, interaction, color) {}
}
