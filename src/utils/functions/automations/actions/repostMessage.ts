import { Client } from '@classes/discord';
import { getAutomationConfig } from '@configs/automationConfig';
import { Message, TextChannel } from 'discord.js';
import { IAutomationAction } from '@typings/schemas';

export const repostMessageAutomation = async (message: Message, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  let sendChannel = message.channel;
  if (action.channelId && action.channelId !== 'current')
    sendChannel = (await message.guild.channels.fetch(action.channelId)) as TextChannel;
  if (action.channelId && !sendChannel) return;

  const content = message.content;
  const embeds = message.embeds;
  const components = message.components;
  await sendChannel.send({ content, embeds, components }).catch(() => {});  
};
