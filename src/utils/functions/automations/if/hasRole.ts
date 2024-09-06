import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { GuildMember } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const hasRoleCheck = async (member: GuildMember | null, client: Client, automation: IAutomationIf) => {
  if (!member) return false;
  if (!member.guild) return false;

  const config = await getAutomationConfig(member.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.roles) return false;
  if (automation.roles?.length === 0) return false;

  let hasRole = false;
  for (const role of automation.roles) {
    if (member.roles.cache.has(role)) hasRole = true;
  }

  return hasRole;
};
