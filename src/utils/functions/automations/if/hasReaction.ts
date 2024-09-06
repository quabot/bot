import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { IAutomationIf } from '@typings/schemas';
import { Message } from 'discord.js';

export const hasReactionCheck = async (message: Message | null, client: Client, automationIf: IAutomationIf) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automationIf.reactions) return false;
  if (automationIf.reactions?.length === 0) return false;
//! UNFINISHED
  // let hasReaction = false;
  for (const reaction of automationIf.reactions) {
    console.log(reaction)
    console.log(message.reactions.cache);
  }

  return true;
};
