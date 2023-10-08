import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('suggestion')
    .setDescription('Leave a suggestion.')
    .addSubcommand(command => command.setName('create').setDescription('Leave a suggestion.'))
    .addSubcommand(command =>
      command
        .setName('delete')
        .setDescription('Delete a suggestion.')
        .addNumberOption(option =>
          option.setName('suggestion-id').setDescription('The ID of the suggestion to delete.').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command
        .setName('approve')
        .setDescription('Approve a suggestion.')
        .addNumberOption(option =>
          option.setName('suggestion-id').setDescription('The ID of the suggestion to approve.').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command
        .setName('deny')
        .setDescription('Deny a suggestion.')
        .addNumberOption(option =>
          option.setName('suggestion-id').setDescription('The ID of the suggestion to deny.').setRequired(true),
        ),
    )
    .addSubcommand(command =>
      command.setName('help').setDescription('Get some information about the suggestions module.'),
    )
    .setDMPermission(false),

  async execute() {},
};
