import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { MessageReaction } from 'discord.js';

export const removeReactionAutomation = async (reaction: MessageReaction, client: Client) => {
  if (!reaction) return;
  if (!reaction.message.guild) return;

  const config = await getAutomationConfig(reaction.message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;
  
  await reaction.remove().catch(() => {});
};
