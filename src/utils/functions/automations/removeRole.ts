import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { GuildMember } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';

export const removeRoleAutomation = async (member: GuildMember | null, client: Client, action: IAutomationAction) => {
  if (!member) return;
  if (!member.guild) return;

  const config = await getAutomationConfig(member.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.role) return;

  await member.roles.remove(action.role).catch(() => {});
};
