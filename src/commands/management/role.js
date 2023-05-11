const { SlashCommandBuilder, Client, ChatInputCommandInteraction, PermissionFlagsBits } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Manage roles.')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageRoles)
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Create a role.')
            .addStringOption(option =>
                option.setDescription('The role name.').setRequired(true).setName('name'))
            .addBooleanOption(option =>
                option.setDescription('Should the role be separated in the sidebar? (Defaults to false)').setRequired(false).setName('hoist'))
            .addBooleanOption(option =>
                option.setDescription('Should the role be mentionable by everyone? (Defaults to false)').setRequired(false).setName('mentionable')
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Delete a role.')
            .addRoleOption(option =>
                option.setDescription('The role to remove.').setRequired(true).setName('role')
            ))
        .addSubcommand(subcommand => subcommand
            .setName('edit')
            .setDescription('Edit a role.')
            .addRoleOption(option =>
                option.setDescription('The role to edit.').setRequired(true).setName('role')
            )
            .addStringOption(option =>
                option.setDescription('The new role name.').setRequired(false).setName('name')
            )
            .addBooleanOption(option =>
                option.setDescription('Should the role be mentionable?').setRequired(false).setName('mentionable')
            )
            .addBooleanOption(option =>
                option.setDescription('Should the role be separated in the sidebar?').setRequired(false).setName('hoist')
            )
        ),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) { }
}