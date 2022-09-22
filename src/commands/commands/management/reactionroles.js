const { ApplicationCommandOptionType, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Create, list and delete reactionroles.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription('Create a reactionrole.')
                .addChannelOption(option => option.setDescription("Channel where the message is located.").setRequired(true).setName("channel"))
                .addStringOption(option => option.setDescription("The id of the message.").setRequired(true).setName("message"))
                .addRoleOption(option => option.setDescription("The role to use.").setRequired(true).setName("role"))
                .addStringOption(option => option.setDescription("The emoji to react with.").setRequired(true).setName("emoji"))
                .addStringOption(option => option
                    .setDescription("The mode to use for the reactionrole.")
                    .setRequired(true)
                    .setName("mode")
                    .addChoices(
                        { name: "Normal", value: "normal" },
                        { name: "Verify", value: "verify" },
                        { name: "Drop", value: "drop" },
                        { name: "Reversed", value: "reversed" },
                        { name: "Unique", value: "unique" },
                        { name: "Binding", value: "binding" },
                    ))
                .addStringOption(option => option.setDescription("The permission required to use this reactionrole.")
                    .setRequired(false)
                    .setName("permission")
                    .addChoices(
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
                    )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a reactionrole.')
                .addStringOption(option => option.setDescription("The message to remove the reactionrole of.").setRequired(true).setName("message_id"))
                .addStringOption(option => option.setDescription("The emoji to remove.").setRequired(true).setName("emoji"))
                .addChannelOption(option => option.setDescription("The channel where the message is located.").setRequired(true).setName("channel")))
        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all reactionroles.')
                .addStringOption(option => option.setDescription("The message to list the reactionroles for.").setRequired(false).setName("message_id"))
                .addRoleOption(option => option.setDescription("The role to list the reactionroles for.").setRequired(false).setName("role"))
                .addChannelOption(option => option.setDescription("The channel to list the reactionroles for.").setRequired(false).setName("channel"))),
    async execute() { }
}