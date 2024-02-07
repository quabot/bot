import { Events, type GuildMember } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.GuildMemberAdd,
  name: 'welcomeMessage',

  async execute({ client }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.joinEnabled) return;

    const channel = member.guild.channels.cache.get(config.joinChannel);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    const parseString = (text: string) =>
      text
        .replaceAll('{user}', `${member}`)
        .replaceAll('{id}', `${member.user.id}`)
        .replaceAll('{username}', member.user.username ?? '')
        .replaceAll('{tag}', member.user.tag ?? '')
        .replaceAll('{discriminator}', member.user.discriminator ?? '')
        .replaceAll('{avatar}', member.displayAvatarURL() ?? '')
        .replaceAll('{icon}', member.guild.iconURL() ?? '')
        .replaceAll('{server}', member.guild.name ?? '')
        .replaceAll('{members}', member.guild.memberCount?.toString() ?? '')
        .replaceAll('{color}', `${custom?.color ?? '#416683'}`);

    switch (config.joinType) {
      case 'embed': {
        const embed = new CustomEmbed(config.joinMessage, parseString);
        await channel.send({
          embeds: [embed],
          content: parseString(config.joinMessage.content),
        });

        break;
      }

      case 'text': {
        if (config.joinMessage.content === '') return;
        await channel.send({ content: parseString(config.joinMessage.content) });

        break;
      }

      case 'card': {
      }
    }
  },
};
