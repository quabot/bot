import { Events, type GuildMember, AttachmentBuilder } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';
import { drawWelcomeCard } from '@functions/cards';

export default {
  event: Events.GuildMemberRemove,
  name: 'leaveMessage',

  async execute({ client }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.leaveEnabled) return;

    const channel = member.guild.channels.cache.get(config.leaveChannel);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const parseString = (text: string) =>
      text
        .replaceAll('{user}', `${member}`)
        .replaceAll('{username}', member.user.username ?? '')
        .replaceAll('{tag}', member.user.tag ?? '')
        .replaceAll('{discriminator}', member.user.discriminator ?? '')
        .replaceAll('{avatar}', member.displayAvatarURL() ?? '')
        .replaceAll('{icon}', member.guild.iconURL() ?? '')
        .replaceAll('{server}', member.guild.name ?? '')
        .replaceAll('{id}', `${member.user.id}`)
        .replaceAll('{members}', member.guild.memberCount?.toString() ?? '')
        .replaceAll('{color}', `${custom?.color ?? '#416683'}`);

    switch (config.leaveType) {
      case 'embed': {
        const embed = new CustomEmbed(config.leaveMessage, parseString);
        await channel.send({
          embeds: [embed],
          content: parseString(config.leaveMessage.content),
        });

        break;
      }

      case 'text': {
        if (config.leaveMessage.content === '') return;
        await channel.send({ content: parseString(config.leaveMessage.content) });
        break;
      }

      case 'card': {
        const card = await drawWelcomeCard(member, config.leaveCard);
        await channel.send({ files: [new AttachmentBuilder(card)] });
        break;
      }
    }
  },
};
