const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Manage channels.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Create a channel.')
            .addStringOption(option =>
                option.setDescription('The channel name.').setRequired(true).setName('name'))
            .addStringOption(option =>
                option.setDescription('The channel topic.').setRequired(false).setName('topic'))
            .addBooleanOption(option =>
                option.setDescription('Should the channel be marked as NSFW?').setRequired(false).setName('nsfw'))
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a channel.')
            .addChannelOption(option =>
                option.setDescription('The channel to remove.').setRequired(true).setName('channel')
            ))
        .addSubcommand(subcommand => subcommand
            .setName('edit')
            .setDescription('Edit a channel.')
            .addChannelOption(option =>
                option.setDescription('The channel to edit.').setRequired(true).setName('channel')
            )
            .addStringOption(option =>
                option.setDescription('The new channel name.').setRequired(false).setName('name')
            )
            .addStringOption(option =>
                option.setDescription('The new channel topic.').setRequired(false).setName('topic')
            )
        ),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}