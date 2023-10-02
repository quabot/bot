import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
//* No execute function is needed because this command is only used for subcommands.
export default {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create and end polls.')

    .addSubcommand(command =>
      command
        .setName('create')
        .setDescription('Create a poll.')
        .addChannelOption(option =>
          option.setName('channel').setDescription('The channel where the poll should be in.').setRequired(true),
        )
        .addNumberOption(option =>
          option.setName('choices').setDescription('The amount of poll choices.').setRequired(true),
        )
        .addStringOption(option =>
          option.setName('duration').setDescription('The length that the poll should last for.').setRequired(true),
        )
        .addRoleOption(option =>
          option
            .setName('role-mention')
            .setDescription('The role to mention when the poll is created.')
            .setRequired(false),
        ),
    )

    .addSubcommand(command =>
      command
        .setName('end')
        .setDescription('End a poll.')
        .addNumberOption(option =>
          option.setName('poll-id').setDescription('The id of the poll to end.').setRequired(true),
        ),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild,
    )
    .setDMPermission(false),

  async execute() {},
};
