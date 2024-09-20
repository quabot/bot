import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { MessageReaction } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const isEmojiCheck = async (reaction: MessageReaction, client: Client, automation: IAutomationIf) => {
  if (!reaction) return false;
  if (!reaction.message.guild) return false;

  const config = await getAutomationConfig(reaction.message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.emoji) return false;

  if (!reaction.emoji.name) return false;

  return reaction.emoji.name === automation.emoji;
};
