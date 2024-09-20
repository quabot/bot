import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Guild, GuildChannel, Message, PartialMessage } from 'discord.js';
import { IAutomationIf } from '@typings/schemas';

export const inChannelCheck = async (
  message: Message | null | PartialMessage | { guild: Guild; channel: GuildChannel },
  client: Client,
  automation: IAutomationIf,
) => {
  if (!message) return false;
  if (!message.guild) return false;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return false;
  if (!config.enabled) return false;

  if (!automation.channels) return false;
  if (automation.channels?.length === 0) return false;

  let inChannel = false;
  for (const channel of automation.channels) {
    if (message.channel.id === channel) inChannel = true;
    if (message.channel instanceof GuildChannel && message.channel.parentId === channel) inChannel = true;
  }

  return inChannel;
};
