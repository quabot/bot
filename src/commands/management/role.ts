import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No execute function is needed because this command is only used for subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('role')
    .setDescription('Manage roles.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageRoles)
    .addSubcommand(subcommand =>
      subcommand
        .setName('create')
        .setDescription('Create a role.')
        .addStringOption(option => option.setDescription('The role name.').setRequired(true).setName('name'))
        .addBooleanOption(option =>
          option
            .setDescription('Should the role be separated in the sidebar? (Defaults to false)')

            .setName('hoist'),
        )
        .addBooleanOption(option =>
          option
            .setDescription('Should the role be mentionable by everyone? (Defaults to false)')

            .setName('mentionable'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('delete')
        .setDescription('Delete a role.')
        .addRoleOption(option => option.setDescription('The role to remove.').setRequired(true).setName('role')),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('all')
        .setDescription('Give a role to all of a certain group.')
        .addStringOption(option =>
          option
            .setDescription('The group to give the role.')
            .setRequired(true)
            .setName('group')
            .addChoices(
              { name: 'All Members', value: 'all' },
              { name: 'Humans', value: 'humans' },
              { name: 'Bots', value: 'bots' },
            ),
        )
        .addRoleOption(option => option.setDescription('The role to give.').setRequired(true).setName('role')),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('edit')
        .setDescription('Edit a role.')
        .addRoleOption(option => option.setDescription('The role to edit.').setRequired(true).setName('role'))
        .addStringOption(option => option.setDescription('The new role name.').setName('name'))
        .addBooleanOption(option => option.setDescription('Should the role be mentionable?').setName('mentionable'))
        .addBooleanOption(option =>
          option.setDescription('Should the role be separated in the sidebar?').setName('hoist'),
        ),
    ),

  async execute() {},
};
