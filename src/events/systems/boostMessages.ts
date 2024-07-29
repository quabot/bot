import { Events, GuildMember } from 'discord.js';
import { getServerConfig } from '@configs/serverConfig';
import type { EventArgs } from '@typings/functionArgs';
import { getBoostConfig } from '@configs/boostConfig';
import { CustomEmbed } from '@constants/customEmbed';
import { BoostParser } from '@classes/parsers';

export default {
  event: Events.GuildMemberUpdate,
  name: 'boostMessages',

  async execute({ client }: EventArgs, oldMember: GuildMember, newMember: GuildMember) {
    if (!newMember.premiumSince) return;
    if (oldMember.premiumSince === newMember.premiumSince) return;

    const config = await getBoostConfig(newMember.guild.id, client);
    if (!config) return;
    if (!config.enabled) return;

    const channel = newMember.guild.channels.cache.get(config.channel);
    if (!channel) return;
    if (!channel.isTextBased()) return;
    
    const serverConfig = await getServerConfig(client, newMember.guild.id);
    const color = serverConfig ? serverConfig.color : '#416683';

    const parser = new BoostParser({ member: newMember, color, guild: newMember.guild });
    let message:any = [];
    if (config.type === 'embed') message = [new CustomEmbed(config.message, parser)];
    
    await channel.send({ embeds: message, content: parser.parse(config.message.content) });
  },
};
