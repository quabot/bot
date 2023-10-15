const { Client, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const { getLevelConfig } = require('@configs/levelConfig');
const Level = require('@schemas/Level');
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'level',
  name: 'reset',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const user = interaction.options.getUser('user');

    if (!user)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You need to specify a user.')],
      });

    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You do not have the required permissions.')],
      });

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

    await Level.findOneAndDelete({
      guildId: interaction.guildId,
      userId: user.id,
    });

    if (config.removeRewards) {
      config.rewards.forEach(async reward => {
        const role = interaction.guild.roles.cache.get(reward.role);
        if (role) await interaction.member.roles.remove(role).catch(() => {});
      });
    }

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Reset ${user}'s level to 0 and xp to 0.`)],
    });
  },
};
