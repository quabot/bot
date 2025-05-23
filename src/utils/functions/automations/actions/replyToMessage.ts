import { Client } from '@classes/discord';
import { GuildParser } from '@classes/parsers';
import { getAutomationConfig } from '@configs/automationConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { ButtonInteraction, Message } from 'discord.js';
import { getButtons } from '../utils/getButtons';
import { IAutomationAction } from '@typings/schemas';

export const replyToMessageAutomation = async (message: Message | ButtonInteraction, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.message) return;

  const parser = new GuildParser(message.guild);
  const embed = new CustomEmbed(action.message, parser);
  const buttons: any = (await getButtons(config.buttons, action.message.buttons ?? [])) ?? [];
  if (!buttons || buttons.length === 0) return await message.reply({ embeds: [embed], content: parser.parse(action.message.content) }).catch(() => { });
  await message.reply({ embeds: [embed], components: [buttons], content: parser.parse(action.message.content) });
};
