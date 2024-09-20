import { Client } from '@classes/discord';
import { GuildParser } from '@classes/parsers';
import { getAutomationConfig } from '@configs/automationConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { GuildMember } from 'discord.js';
import { getButtons } from '../utils/getButtons';
import { IAutomationAction } from '@typings/schemas';

export const sendDmAutomation = async (member: GuildMember | null, client: Client, action: IAutomationAction) => {
  if (!member) return;
  if (!member.guild) return;

  const config = await getAutomationConfig(member.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.message) return;

  const parser = new GuildParser(member.guild);
  const embed = new CustomEmbed(action.message, parser);
  const buttons: any = (await getButtons(config.buttons, action.message.buttons ?? [])) ?? [];
  if (!buttons || buttons.length === 0) return await member.send({ embeds: [embed], content: parser.parse(action.message.content) }).catch(() => { });
  await member.send({ embeds: [embed], components: [buttons], content: parser.parse(action.message.content) }).catch(() => { });
};
