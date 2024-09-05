import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';
import { getLevelConfig } from '@configs/levelConfig';
import { getLevel } from '@configs/level';
import { getServerConfig } from '@configs/serverConfig';
import { hasRolePerms } from '@functions/discord';

export const removeXPAutomation = async (message: Message | null, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;
  if (message.author.bot) return;

  const aConfig = await getAutomationConfig(message.guild.id, client);
  if (!aConfig) return;
  if (!aConfig.enabled) return;

  if (!action.xp) return;

  const guild = message.guild;
  const msgChannel = message.channel;
  const member = message.member;
  if (!member) return;

  const config = await getLevelConfig(guild.id, client);
  if (!config) return;
  if (!config.enabled) return;
  if (config.excludedChannels!.includes(msgChannel.id)) return;

  const levelDB = await getLevel(guild.id, message.author.id);

  const configColor = await getServerConfig(client, guild.id);
  const color = configColor?.color ?? '#416683';
  if (!color) return;

  if (!levelDB) return;

  let xp = levelDB.xp - action.xp;
  if (xp < 0) xp = 0;

  let step1 = xp - 100;
  if (step1 < 0) step1 = 0;
  const levelForXp = () => Math.sqrt(step1 / 120);
  const levelForXpResult = levelForXp();
  const newLevel = levelForXpResult;

  if (config.removeRewards) {
    config.rewards!.forEach(async reward => {
      if (!hasRolePerms(await message.guild?.roles.fetch(reward.role))) return;

      if (newLevel < reward.level) {
        await member.roles.remove(reward.role).catch(() => {});
      }

      if (newLevel >= reward.level) {
        await member.roles.add(reward.role).catch(() => {});
      }
    });
  }

  levelDB.level = levelForXp();
  levelDB.xp = xp;
  await levelDB.save();
};
