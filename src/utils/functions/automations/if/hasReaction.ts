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

  let hasReaction = false;
  for (const reaction of message.reactions.cache) {
    const reactionConfig = automationIf.reactions.find(r => reaction[0] === r.reaction);
    if (reactionConfig) {
      if (reaction[1].count >= reactionConfig.count) hasReaction = true;
    }
  }

  return hasReaction;
};
