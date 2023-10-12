import { Events, Colors, type GuildChannel, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

module.exports = {
  event: Events.ChannelUpdate,
  name: 'channelUpdate',

  async execute({ client }: EventArgs, oldChannel: GuildChannel, newChannel: GuildChannel) {
    if (!newChannel.guildId) return;

    const config = await getLoggingConfig(client, newChannel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('channelUpdate')) return;
    if (newChannel.parentId && config.excludedCategories!.includes(newChannel.parentId)) return;
    if (config.excludedChannels!.includes(newChannel.id)) return;

    const logChannel = newChannel.guild.channels.cache.get(config.channelId);
    if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
      return;

    let description = '';
    if (oldChannel.rawPosition !== newChannel.rawPosition) return;
    if (oldChannel.type !== newChannel.type)
      description += `\n**Type:**\n\`${CHANNEL_TYPES_BY_ID[oldChannel.type]}\` -> \`${
        CHANNEL_TYPES_BY_ID[newChannel.type]
      }\``;
    if (oldChannel.name !== newChannel.name)
      description += `\n**Name:** \n\`${oldChannel.name}\` -> \`${newChannel.name}\``;

    if ('topic' in oldChannel && 'topic' in newChannel) {
      if (oldChannel.topic !== newChannel.topic)
        description += `\n**Description:** \n\`${oldChannel.topic ? `${oldChannel.topic}` : 'None'}\` -> \`${
          newChannel.topic ? `${newChannel.topic}` : 'None'
        }\``;
    } //VoiceChannel CategoryChannel

    if (oldChannel.parentId !== newChannel.parentId)
      description += `\n**Category:** \n${oldChannel.parentId ? `<#${oldChannel.parentId}>` : 'none'} -> ${
        newChannel.parentId ? `<#${newChannel.parentId}>` : 'none'
      }`;

    if (oldChannel.type !== ChannelType.GuildCategory && newChannel.type !== ChannelType.GuildCategory) {
      oldChannel = oldChannel as ;
      newChannel = ;

      if (oldChannel.nsfw !== newChannel.nsfw)
        description += `\n**NSFW:** \n\`${oldChannel.nsfw ? 'Yes' : 'No'}\` -> \`${newChannel.nsfw ? 'Yes' : 'No'}\``;
    }
    // CategoryChannel

    if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser)
      description += `\n**Ratelimit:** \n\`${oldChannel.rateLimitPerUser}s\` -> \`${newChannel.rateLimitPerUser}s\``;
    if (oldChannel.rtcRegion !== newChannel.rtcRegion)
      description += `\n**Region:** \n\`${oldChannel.rtcRegion ? `${oldChannel.rtcRegion}` : 'Automatic'}\` -> \`${
        newChannel.rtcRegion ? `${newChannel.rtcRegion}` : 'Automatic'
      }\``;
    if (oldChannel.bitrate !== newChannel.bitrate)
      description += `\n**Bitrate:** \n\`${oldChannel.bitrate / 1000}kbps\` -> \`${newChannel.bitrate / 1000}kbps\``;
    if (oldChannel.userLimit !== newChannel.userLimit)
      description += `\n**User Limit:** \n\`${oldChannel.userLimit}\` -> \`${newChannel.userLimit}\``;
    if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration)
      description += `\n**Auto Archive:** \n\`${oldChannel.defaultAutoArchiveDuration}s\` -> \`${newChannel.defaultAutoArchiveDuration}s\``;

    if (description === '') return;
    await logChannel.send({
      embeds: [
        new Embed(Colors.Yellow).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[newChannel.type]} Channel Edited**
                        ${logChannel}
                        ${description}
                        `),
      ],
    });
  },
};
