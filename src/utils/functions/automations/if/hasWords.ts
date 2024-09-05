import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const containedWordsCheck = async (message: Message | null, client: Client, automation: IAutomationIf) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.words) return false;
  if (automation.words?.length === 0) return false;

  let hasWord = false;
  for (const word of automation.words) {
    if (message.content.toLowerCase().includes(word.toLowerCase())) hasWord = true;
  }

  return hasWord;
};
