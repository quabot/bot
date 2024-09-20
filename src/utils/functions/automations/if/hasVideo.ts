import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message, PartialMessage } from 'discord.js';

export const hasVideoCheck = async (message: Message | PartialMessage | null, client: Client) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!message.attachments.size) return false;

  const images = message.attachments.filter((attachment) => attachment.contentType?.startsWith('video/'));
  if (!images.size) return false;

  return true;
};
