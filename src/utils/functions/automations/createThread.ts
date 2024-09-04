import { Client } from '@classes/discord';
import { MemberParser } from '@classes/parsers';
import { getAutomationConfig } from '@configs/automationConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { GuildMember, Message } from 'discord.js';
import { getButtons } from './utils/getButtons';
import { IAutomationAction } from '@typings/schemas';

export const createThreadAutomation = async (message: Message | null, client: Client, action: IAutomationAction) => {
  if (!message) return;
  if (!message.guild) return;

  const config = await getAutomationConfig(message.guild.id, client);
  if (!config) return;
  if (!config.enabled) return;

  if (!action.threadName) return;
  if (!message.member) return;

  const memberParser = new MemberParser({ member: message.member as GuildMember, color: '#416683' });
  await message
    .startThread({
      name: memberParser.parse(action.threadName),
      reason: 'automated thread creation from automation',
    })
    .then(async thread => {
      if (!action.message) return;

      const embed = new CustomEmbed(action.message, memberParser);
      const buttons: any = (await getButtons(config.buttons, action.message.buttons ?? [])) ?? [];
      await thread.send({ embeds: [embed], components: [buttons], content: memberParser.parse(action.message.content) });
    });
};
