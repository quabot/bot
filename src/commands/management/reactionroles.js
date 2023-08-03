const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No execute function is needed for this command.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Create, view and delete reaction roles.')

        .addSubcommand(command => command
            .setName('create')
            .setDescription('Create a reaction role.')
            .addChannelOption(option => option
                .setName('channel')
                .setDescription('The channel where the message is located.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('message-id')
                .setDescription('The id of the message to use for the reaction role.')
                .setRequired(true))
            .addRoleOption(option => option
                .setName('role')
                .setDescription('The role to use for the reaction role.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('emoji')
                .setDescription('The emoji to use for the reaction role.')
                .setRequired(true))
            .addStringOption(option => option
                .setName('mode')
                .setDescription('The mode to use for the reaction role.')
                .addChoices(
                    { name: 'Normal', value: 'normal' },
                    { name: 'Verify', value: 'verify' },
                    { name: 'Drop', value: 'drop' },
                    { name: 'Reversed', value: 'reversed' },
                    { name: 'Unique', value: 'unique' },
                    { name: 'Binding', value: 'binding' }
                )
                .setRequired(true))
            .addStringOption(option => option
                .setName('required-permission')
                .setDescription('The permission users need to have to use the reaction role.')
                .setRequired(false)
                .addChoices(
                    { name: 'Create Instant Invite', value: `${PermissionFlagsBits.CreateInstantInvite}` },
                    { name: 'Kick Members', value: `${PermissionFlagsBits.KickMembers}` },
                    { name: 'Ban Members', value: `${PermissionFlagsBits.BanMembers}` },
                    { name: 'Timeout Members', value: `${PermissionFlagsBits.ModerateMembers}` },
                    { name: 'Administrator', value: `${PermissionFlagsBits.Administrator}` },
                    { name: 'Manage Channels', value: `${PermissionFlagsBits.ManageChannels}` },
                    { name: 'Manage Server', value: `${PermissionFlagsBits.ManageGuild}` },
                    { name: 'Add Reactions', value: `${PermissionFlagsBits.AddReactions}` },
                    { name: 'View Channel', value: `${PermissionFlagsBits.ViewChannel}` },
                    { name: 'Send Messages', value: `${PermissionFlagsBits.SendMessages}` },
                    { name: 'Manage Messages', value: `${PermissionFlagsBits.ManageMessages}` },
                    { name: 'Attach Files', value: `${PermissionFlagsBits.AttachFiles}` },
                    { name: 'Read Message History', value: `${PermissionFlagsBits.ReadMessageHistory}` },
                    { name: 'Mention Everyone', value: `${PermissionFlagsBits.MentionEveryone}` },
                    { name: 'Use External Emojis', value: `${PermissionFlagsBits.UseExternalEmojis}` },
                    { name: 'Connect', value: `${PermissionFlagsBits.Connect}` },
                    { name: 'Speak', value: `${PermissionFlagsBits.Speak}` },
                    { name: 'Mute Members', value: `${PermissionFlagsBits.MuteMembers}` },
                    { name: 'Deafen Members', value: `${PermissionFlagsBits.DeafenMembers}` },
                    { name: 'Move Members', value: `${PermissionFlagsBits.MoveMembers}` },
                    { name: 'Change Nickname', value: `${PermissionFlagsBits.ChangeNickname}` },
                    { name: 'Manage Nicknames', value: `${PermissionFlagsBits.ManageNicknames}` },
                    { name: 'Manage Roles', value: `${PermissionFlagsBits.ManageRoles}` },
                    {
                        name: 'Use Application Commands',
                        value: `${PermissionFlagsBits.UseApplicationCommands}`,
                    },
                    { name: 'Manage Threads', value: `${PermissionFlagsBits.ManageThreads}` }
                )))

        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription('Delete a reaction role.')
                .addStringOption(option =>
                    option
                        .setDescription('The message to remove the reaction role of.')
                        .setRequired(true)
                        .setName('message-id')
                )
                .addStringOption(option => option
                    .setDescription('The emoji to remove.')
                    .setRequired(true)
                    .setName('emoji')
                )
                .addChannelOption(option =>
                    option
                        .setDescription('The channel where the message is located.')
                        .setRequired(true)
                        .setName('channel')
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('list')
                .setDescription('List all reaction roles.')
                .addStringOption(option =>
                    option
                        .setDescription('The message to list the reaction roles for.')
                        .setRequired(false)
                        .setName('message-id')
                )
                .addRoleOption(option => option
                    .setDescription('The role to list the reaction roles for.')
                    .setRequired(false)
                    .setName('role')
                )
                .addChannelOption(option =>
                    option
                        .setDescription('The channel to list the reaction roles for.')
                        .setRequired(false)
                        .setName('channel')
                )
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('help')
                .setDescription('View information about the reactionroles module.'))

        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}