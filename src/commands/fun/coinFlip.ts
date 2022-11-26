import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin.')
    .setDMPermission(true),
  async execute(client: Client, interaction: CommandInteraction, color: any) {
    await interaction.deferReply();

    await interaction.editReply({
      embeds: [
        embed(color).setTitle(
          ['🪙 Heads!', '🪙 Tails!'][Math.floor(Math.random() * 2)]
        ),
      ],
    });
  },
};
