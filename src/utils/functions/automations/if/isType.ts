import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Channel } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const isTypeCheck = async (channel: Channel | null, client: Client, automation: IAutomationIf) => {
  if (!channel) return false;
  if (channel.isDMBased()) return false;
  if (!channel.guild) return false;

  const config = await getAutomationConfig(channel.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (automation.channelType === undefined) return false;

  if (channel.type === automation.channelType) return true;

  return false;
};
