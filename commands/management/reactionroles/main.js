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
                        { name: "Create Instant Invite", value: `${PermissionFlagsBits.CreateInstantInvite}` },
                        { name: "Kick Members", value: `${PermissionFlagsBits.KickMembers}` },
                        { name: "Ban Members", value: `${PermissionFlagsBits.BanMembers}` },
                        { name: "Timeout Members", value: `${PermissionFlagsBits.ModerateMembers}` },
                        { name: "Administrator", value: `${PermissionFlagsBits.Administrator}` },
                        { name: "Manage Channels", value: `${PermissionFlagsBits.ManageChannels}` },
                        { name: "Manage Server", value: `${PermissionFlagsBits.ManageGuild}` },
                        { name: "Add Reactions", value: `${PermissionFlagsBits.AddReactions}` },
                        { name: "View Channel", value: `${PermissionFlagsBits.ViewChannel}` },
                        { name: "Send Messages", value: `${PermissionFlagsBits.SendMessages}` },
                        { name: "Manage Messages", value: `${PermissionFlagsBits.ManageMessages}` },
                        { name: "Attach Files", value: `${PermissionFlagsBits.AttachFiles}` },
                        { name: "Read Message History", value: `${PermissionFlagsBits.ReadMessageHistory}` },
                        { name: "Mention Everyone", value: `${PermissionFlagsBits.MentionEveryone}` },
                        { name: "Use External Emojis", value: `${PermissionFlagsBits.UseExternalEmojis}` },
                        { name: "Connect", value: `${PermissionFlagsBits.Connect}` },
                        { name: "Speak", value: `${PermissionFlagsBits.Speak}` },
                        { name: "Mute Members", value: `${PermissionFlagsBits.MuteMembers}` },
                        { name: "Deafen Members", value: `${PermissionFlagsBits.DeafenMembers}` },
                        { name: "Move Members", value: `${PermissionFlagsBits.MoveMembers}` },
                        { name: "Change Nickname", value: `${PermissionFlagsBits.ChangeNickname}` },
                        { name: "Manage Nicknames", value: `${PermissionFlagsBits.ManageNicknames}` },
                        { name: "Manage Roles", value: `${PermissionFlagsBits.ManageRoles}` },
                        { name: "Use Application Commands", value: `${PermissionFlagsBits.UseApplicationCommands}` },
                        { name: "Manage Threads", value: `${PermissionFlagsBits.ManageThreads}` }
                    ],
                },
                {
                    name: "mode",
                    description: "Reactionrole mode.",
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
