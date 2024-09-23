import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';

export const reactToMessageAutomation = async (message: Message, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.reaction) return;

  await message.react(action.reaction).catch(() => {});
};
