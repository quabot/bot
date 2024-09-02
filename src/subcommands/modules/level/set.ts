import { Embed } from '@constants/embed';
import { getLevelConfig } from '@configs/levelConfig';
import { getLevel } from '@configs/level';
import type { CommandArgs } from '@typings/functionArgs';
import { hasAnyPerms, hasRolePerms } from '@functions/discord';
import { PermissionFlagsBits } from 'discord.js';

export default {
  parent: 'level',
  name: 'set',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

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

    const user = interaction.options.getUser('user', true);
    const member = interaction.options.getMember('user');
    if (!member)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("This user isn't in the guild anymore.")],
      });

    if (user.bot) return await interaction.editReply({
      embeds: [new Embed(color).setDescription('Bots cannot get XP. Someone should get them some chocolate, so they won\'t feel left out ;(')],
    });

    const levelDB = await getLevel(interaction.guildId!, user.id);
    if (!levelDB)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    const xp = interaction.options.getNumber('xp') ?? levelDB.xp;
    const level = interaction.options.getNumber('level') ?? levelDB.level;

    if (config.removeRewards) {
      config.rewards!.forEach(async reward => {
        if (!hasRolePerms(await interaction.guild?.roles.fetch(reward.role))) return;

        if (level < reward.level) {
          if ('remove' in member.roles) await member.roles.remove(reward.role).catch(() => { });
        }

        if (level >= reward.level) {
          if ('add' in member.roles) await member.roles.add(reward.role).catch(() => { });
        }
      });
    }

    
    const levelForXp = (xp: number) => Math.floor((Math.sqrt(30 * xp + 2700) + 90) / 60);
    const levelForXpResult = levelForXp(xp);
    
    if (!level) levelDB.level = levelForXpResult;
    if (xp) levelDB.xp = xp;
    if (level) levelDB.level = level;
    await levelDB.save().catch(() => null);

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `Successfully set ${user}'s level to ${level ?? levelDB.level} and xp to ${xp ?? levelDB.xp}.`,
        ),
      ],
    });
  },
};
