import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message, PartialMessage } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const isSentenceCheck = async (message: Message | PartialMessage | null, client: Client, automation: IAutomationIf) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.sentence) return false;

  const content = message.content ?? "";
  if (content.toLowerCase() === automation.sentence.toLowerCase()) return true;

  return false;
};
