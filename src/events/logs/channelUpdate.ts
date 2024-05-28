import { Events, Colors } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import type { GuildChannel } from '@typings/discord';
import { hasSendPerms } from '@functions/discord';
import { ChannelType } from 'discord.js';

export default {
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
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(logChannel)) return;

    let actions = ['', '', '', '', '', '', '', '', '', ''];
    if (oldChannel.rawPosition !== newChannel.rawPosition) return;

    //* On every GuildChannel
    if (oldChannel.type !== newChannel.type)
      actions[0] = `\n**Type:**\n\`${CHANNEL_TYPES_BY_ID[oldChannel.type]}\` -> \`${
        CHANNEL_TYPES_BY_ID[newChannel.type]
      }\``;

    if (oldChannel.name !== newChannel.name)
      actions[1] = `\n**Name:** \n\`${oldChannel.name}\` -> \`${newChannel.name}\``;
    if (oldChannel.parentId !== newChannel.parentId)
      actions[3] = `\n**Category:** \n${oldChannel.parentId ? `<#${oldChannel.parentId}>` : 'none'} -> ${
        newChannel.parentId ? `<#${newChannel.parentId}>` : 'none'
      }`;

    //* Not on GuildCategory
    if (oldChannel.type !== ChannelType.GuildCategory && newChannel.type !== ChannelType.GuildCategory) {
      if (oldChannel.nsfw !== newChannel.nsfw)
        actions[4] = `\n**NSFW:** \n\`${oldChannel.nsfw ? 'Yes' : 'No'}\` -> \`${newChannel.nsfw ? 'Yes' : 'No'}\``;

      if (oldChannel.rateLimitPerUser !== newChannel.rateLimitPerUser)
        actions[5] = `\n**Ratelimit:** \n\`${oldChannel.rateLimitPerUser}s\` -> \`${newChannel.rateLimitPerUser}s\``;

      //* Not on GuildCategory & GuildVoice
      if (oldChannel.type !== ChannelType.GuildVoice && newChannel.type !== ChannelType.GuildVoice) {
        if (oldChannel.topic !== newChannel.topic)
          actions[2] = `\n**Description:** \n\`${oldChannel.topic ? `${oldChannel.topic}` : 'None'}\` -> \`${
            newChannel.topic ? `${newChannel.topic}` : 'None'
          }\``;

        //* Not on GuildCategory, GuildVoice & GuildStageVoice
        if (oldChannel.type !== ChannelType.GuildStageVoice && newChannel.type !== ChannelType.GuildStageVoice)
          if (oldChannel.defaultAutoArchiveDuration !== newChannel.defaultAutoArchiveDuration)
            actions[9] = `\n**Auto Archive:** \n\`${oldChannel.defaultAutoArchiveDuration}s\` -> \`${newChannel.defaultAutoArchiveDuration}s\``;
      }
    }

    //* Only on GuildVoice & GuildStageVoice
    if (
      (oldChannel.type === ChannelType.GuildVoice || oldChannel.type === ChannelType.GuildStageVoice) &&
      (newChannel.type === ChannelType.GuildVoice || newChannel.type === ChannelType.GuildStageVoice)
    ) {
      if (oldChannel.rtcRegion !== newChannel.rtcRegion)
        actions[6] = `\n**Region:** \n\`${oldChannel.rtcRegion ? `${oldChannel.rtcRegion}` : 'Automatic'}\` -> \`${
          newChannel.rtcRegion ? `${newChannel.rtcRegion}` : 'Automatic'
        }\``;

      if (oldChannel.bitrate !== newChannel.bitrate)
        actions[7] = `\n**Bitrate:** \n\`${oldChannel.bitrate / 1000}kbps\` -> \`${newChannel.bitrate / 1000}kbps\``;

      if (oldChannel.userLimit !== newChannel.userLimit)
        actions[8] = `\n**User Limit:** \n\`${oldChannel.userLimit}\` -> \`${newChannel.userLimit}\``;
    }

    const description = actions.join('');

    if (!description) return;
    await logChannel
      .send({
        embeds: [
          new Embed(Colors.Yellow).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[newChannel.type]} Channel Edited**
                        ${logChannel}
                        ${description}
                        `),
        ],
      })
      .catch(() => {});
  },
};
