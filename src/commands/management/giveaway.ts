import { GuildTextBasedChannel } from '@typings/discord';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

//* Create the command and pass the SlashCommandBuilder to the handler.
export default {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Create, edit, reroll and end giveaways.')

    .addSubcommand(command =>
      command
        .setName('create')
        .setDescription('Create a giveaway.')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('The channel where the giveaway should be in.')
            .setRequired(true)
            .addChannelTypes(...GuildTextBasedChannel),
        )
        .addStringOption(option =>
          option.setName('prize').setDescription('The prize for winning the giveaway.').setRequired(true),
        )
        .addNumberOption(option =>
          option.setName('winners').setDescription('The amount of winners for the giveaway.').setRequired(true),
        )
        .addStringOption(option =>
          option.setName('duration').setDescription('The length that the giveaway should last for.').setRequired(true),
        )
        .addRoleOption(option =>
          option.setName('winner-role').setDescription('The role that the winner(s) will receive.').setRequired(false),
        ),
    )

    .addSubcommand(command =>
      command
        .setName('reroll')
        .setDescription('Re-roll a giveaway.')
        .addNumberOption(option =>
          option.setName('giveaway-id').setDescription('The id of the giveaway to re-roll.').setRequired(true),
        ),
    )

    .addSubcommand(command =>
      command
        .setName('end')
        .setDescription('End a giveaway.')
        .addNumberOption(option =>
          option.setName('giveaway-id').setDescription('The id of the giveaway to end.').setRequired(true),
        ),
    )
    .setDefaultMemberPermissions(
      PermissionFlagsBits.Administrator | PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild,
    )
    .setDMPermission(false),

  async execute() {},
};
