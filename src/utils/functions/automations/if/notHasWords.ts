import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message, PartialMessage } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const notHasWordsCheck = async (message: Message | PartialMessage | null, client: Client, automation: IAutomationIf) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.words) return false;
  if (automation.words?.length === 0) return false;

  let hasNotWord = true;
  for (const word of automation.words) {
    const content = message.content ?? "";
    if (content.toLowerCase().includes(word.toLowerCase())) hasNotWord = false;
  }

  return hasNotWord;
};
