import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message } from 'discord.js';

export const removeReactionsAutomation = async (message: Message, client: Client) => {
  if (!message) return;
  if (!message.guild) return;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  await message.reactions.removeAll().catch(() => {});
};
