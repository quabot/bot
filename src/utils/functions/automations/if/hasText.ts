import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message, PartialMessage } from 'discord.js';

export const hasTextCheck = async (message: Message | PartialMessage | null, client: Client) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!message.attachments.size) return false;

  console.log(message.attachments)
  const images = message.attachments.filter((attachment) => attachment.contentType?.startsWith('text/'));
  if (!images.size) return false;

  return true;
};
