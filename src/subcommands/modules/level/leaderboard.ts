import { Embed } from '@constants/embed';
import { getLevelConfig } from '@configs/levelConfig';
import type { CommandArgs } from '@typings/functionArgs';
import Level from '@schemas/Level';

export default {
  parent: 'level',
  name: 'leaderboard',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const config = await getLevelConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Levels are disabled in this server.')],
      });

    const leaderboard = await Level.find({
      guildId: interaction.guildId,
      active: true,
    })
      .sort({ level: -1, xp: -1 })
      .limit(25);

    let lb = '';
    leaderboard.forEach(
      i => (lb = lb + `**${leaderboard.indexOf(i) + 1}.** <@${i.userId}> - Level: ${i.level}, XP: ${Math.round(i.xp)}\n`),
    );

    await interaction.editReply({
      embeds: [
        new Embed(color)
          .setTitle(`${interaction.guild?.name}'s level leaderboard`)
          .setDescription(
            `To view the full leaderboard, visit our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/level/leaderboard)\n\n${lb}`,
          ),
      ],
    });
  },
};
