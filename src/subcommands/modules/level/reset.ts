import { PermissionFlagsBits } from 'discord.js';
import { getLevelConfig } from '@configs/levelConfig';
import Level from '@schemas/Level';
import { Embed } from '@constants/embed';
import { hasAnyPerms, hasRolePerms } from '@functions/discord';
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

    if (!hasAnyPerms(interaction.member, [PermissionFlagsBits.ManageGuild]))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('You do not have the required permissions. (Manage Server)')],
      });

    const config = await getLevelConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
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
      config.rewards!.forEach(async reward => {
        if (!hasRolePerms(await interaction.guild?.roles.fetch(reward.role))) return;

        if (interaction.member && 'remove' in interaction.member.roles)
          await interaction.member.roles.remove(reward.role).catch(() => {});
      });
    }

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Reset ${user}'s level to 0 and xp to 0.`)],
    });
  },
};
