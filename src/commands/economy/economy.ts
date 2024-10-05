import { SlashCommandBuilder } from 'discord.js';

//* Create the /economy [args] command.
export default {
  data: new SlashCommandBuilder()
    .setName('economy')
    .setDescription("Use QuaBot's economy system.")
    .addSubcommand(subcommand =>
      subcommand
        .setName('gamble')
        .setDescription('Gamble your coins.')
        .addIntegerOption(option =>
          option
            .setName('amount')
            .setDescription('The amount of coins you want to gamble.')
            .setRequired(true),
        ),
    ),
  async execute() {},
};