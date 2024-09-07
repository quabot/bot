import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Role } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const gainedRoleCheck = async (gainedRole: Role, client: Client, automation: IAutomationIf) => {
  if (!gainedRole) return false;
  if (!gainedRole.guild) return false;

  const config = await getAutomationConfig(gainedRole.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.role) return false;

  if (gainedRole.id !== automation.role) return false;

  return true;
};
