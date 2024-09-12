import { Client } from '@classes/discord';
import { GuildParser } from '@classes/parsers';
import { getAutomationConfig } from '@configs/automationConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { GuildChannel, TextChannel, ThreadChannel, VoiceBasedChannel } from 'discord.js';
import { getButtons } from '../utils/getButtons';
import { IAutomationAction } from '@typings/schemas';

export const sendMessageAutomation = async (channel: TextChannel | VoiceBasedChannel | ThreadChannel | GuildChannel | null, client: Client, action: IAutomationAction) => {
  if (!channel) return;
  if (!channel.guild) return;
  if (!channel.isTextBased()) return;

  const config = await getAutomationConfig(channel.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  let sendChannel = channel;
  if (action.channelId && action.channelId !== 'current')
    sendChannel = (await client.channels.fetch(action.channelId)) as TextChannel;
  if (action.channelId && !sendChannel) return;
  if (!sendChannel.isTextBased()) return;

  if (!action.message) return;

  const parser = new GuildParser(sendChannel.guild);
  const embed = new CustomEmbed(action.message, parser);
  const buttons: any = (await getButtons(config.buttons, action.message.buttons ?? [])) ?? [];
  if (!buttons || buttons.length === 0) return await sendChannel.send({ embeds: [embed], content: parser.parse(action.message.content) }).catch(() => {});
  await sendChannel.send({ embeds: [embed], components: [buttons], content: parser.parse(action.message.content) }).catch(() => {});
};
