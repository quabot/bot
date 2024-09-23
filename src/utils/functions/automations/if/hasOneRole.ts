import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { GuildMember } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const hasOneRoleCheck = async (member: GuildMember | null, client: Client, automation: IAutomationIf) => {
  if (!member) return false;
  if (!member.guild) return false;

  const config = await getAutomationConfig(member.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.role) return false;

  if (!member.roles.cache.has(automation.role)) return false;

  return true;
};
