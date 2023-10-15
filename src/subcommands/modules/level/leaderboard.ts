const { Client, ChatInputCommandInteraction } = require('discord.js');
import { Embed } from '@constants/embed';
const { getLevelConfig } = require('@configs/levelConfig');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'level',
  name: 'leaderboard',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const config = await getLevelConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use, please try again.",
          ),
        ],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Levels are disabled in this server.')],
      });

    const Level = require('@schemas/Level');
    const leaderboard = await Level.find({
      guildId: interaction.guildId,
      active: true,
    })
      .sort({ level: -1, xp: -1 })
      .limit(25);

    let lb = '';
    leaderboard.forEach(
      i => (lb = lb + `**${leaderboard.indexOf(i) + 1}.** <@${i.userId}> - Level: ${i.level}, XP: ${i.xp}\n`),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle(`${interaction.guild.name}'s level leaderboard`)
          .setDescription(
            `To view the full leaderboard, visit our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/levels/leaderboard)\n\n${lb}`,
          ),
      ],
    });
  },
};
