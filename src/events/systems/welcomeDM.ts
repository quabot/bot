import { Events, type GuildMember } from 'discord.js';
import type { EventArgs } from '@typings/functionArgs';
import { getServerConfig } from '@configs/serverConfig';
import { getWelcomeConfig } from '@configs/welcomeConfig';
import { CustomEmbed } from '@constants/customEmbed';

export default {
  event: Events.GuildMemberAdd,
  name: 'welcomeDM',

  async execute({ client }: EventArgs, member: GuildMember) {
    const config = await getWelcomeConfig(client, member.guild.id);
    const custom = await getServerConfig(client, member.guild.id);
    if (!config) return;
    if (!config.joinDM) return;

    const parseString = (text: string) =>
      text
        .replaceAll('{user}', `${member}`)
        .replaceAll('{username}', member.user.username ?? '')
        .replaceAll('{id}', `${member.user.id}`)
        .replaceAll('{tag}', member.user.tag ?? '')
        .replaceAll('{discriminator}', member.user.discriminator ?? '')
        .replaceAll('{avatar}', member.displayAvatarURL() ?? '')
        .replaceAll('{icon}', member.guild.iconURL() ?? '')
        .replaceAll('{server}', member.guild.name ?? '')
        .replaceAll('{members}', member.guild.memberCount?.toString() ?? '')
        .replaceAll('{color}', `${custom?.color ?? '#416683'}`);

    if (config.joinDMType === 'embed') {
      const embed = new CustomEmbed(config.dm, parseString);
      await member.send({
        embeds: [embed],
        content: parseString(config.dm.content),
      });
    } else {
      if (config.dm.content === '') return;
      await member.send({ content: parseString(config.dm.content) });
    }
  },
};
