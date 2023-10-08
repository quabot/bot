import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('punishments')
    .setDescription('Manage punishments.')
    .addSubcommand(subcommand =>
      subcommand
        .setName('manage')
        .setDescription('Manage punishments, delete and deactivate.')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('The type of punishment.')
            .setRequired(true)
            .addChoices(
              { name: 'Kick', value: 'kick' },
              { name: 'Ban', value: 'ban' },
              { name: 'Tempban', value: 'tempban' },
              { name: 'Timeout', value: 'timeout' },
              { name: 'Warn', value: 'warn' },
            ),
        )
        .addStringOption(option => option.setName('id').setDescription('The ID of the punishment.').setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('The user to manage the punishment of.')),
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View punishments. (With filters)')
        .addStringOption(option =>
          option
            .setName('type')
            .setDescription('The type of punishment.')

            .addChoices(
              { name: 'Kick', value: 'kick' },
              { name: 'Ban', value: 'ban' },
              { name: 'Tempban', value: 'tempban' },
              { name: 'Timeout', value: 'timeout' },
              { name: 'Warn', value: 'warn' },
            ),
        )
        .addStringOption(option => option.setName('id').setDescription('The ID of the punishment(s).'))
        .addUserOption(option => option.setName('user').setDescription('The user to view the punishments of.'))
        .addStringOption(option =>
          option.setName('user-id').setDescription('The user (ID) to view the punishments of.'),
        )
        .addUserOption(option =>
          option.setName('staff-member').setDescription('The staff member that carried out the infraction.'),
        ),
    )
    .addSubcommand(subcommand =>
      subcommand.setName('help').setDescription('Get some information about the punishments module.'),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers,
    )
    .setDMPermission(false),

  async execute() {},
};
