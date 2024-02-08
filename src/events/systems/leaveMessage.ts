import { Events, type GuildMember, AttachmentBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { drawWelcomeCard } from '@functions/cards';
import { MemberParser } from '@classes/parsers';

export default {
  event: Events.GuildMemberRemove,
  name: 'leaveMessage',

  async execute({ client, color }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.leaveEnabled) return;

    const channel = member.guild.channels.cache.get(config.leaveChannel);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    color = custom?.color ?? color;

    const parser = new MemberParser({ member, color });

    switch (config.leaveType) {
      case 'embed': {
        const embed = new CustomEmbed(config.leaveMessage, parser);
        await channel.send({
          embeds: [embed],
          content: parser.parse(config.leaveMessage.content),
        });

        break;
      }

      case 'text': {
        if (config.leaveMessage.content === '') return;
        await channel.send({ content: parser.parse(config.leaveMessage.content) });
        break;
      }

      case 'card': {
        const card = await drawWelcomeCard(member, color, config.leaveCard);
        await channel.send({ files: [new AttachmentBuilder(card)] });
        break;
      }
    }
  },
};
