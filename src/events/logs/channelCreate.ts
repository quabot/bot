import { Events, Colors, type GuildChannel, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.ChannelCreate,
  name: 'channelCreate',

  async execute({ client }: EventArgs, channel: GuildChannel) {
    console.log(`🚀 ~ file: channelCreate.ts:10 ~ 'channelCreate':`, 'channelCreate');
    if (!channel.guildId) return;

    const config = await getLoggingConfig(client, channel.guildId);
    console.log(`🚀 ~ file: channelCreate.ts:15 ~ execute ~ config:`, config);
    if (!config) return;
    if (!config.enabled) return;
    console.log(`🚀 ~ file: channelCreate.ts:19 ~ execute ~ config.enabled:`, config.enabled);

    if (!config.events!.includes('channelCreate')) return;
    console.log(
      `🚀 ~ file: channelCreate.ts:22 ~ execute ~ !config.events!.includes('channelCreate'):`,
      !config.events!.includes('channelCreate'),
    );
    if (channel.parentId && config.excludedCategories!.includes(channel.parentId)) return;
    console.log(
      `🚀 ~ file: channelCreate.ts:24 ~ execute ~ channel.parentId && config.excludedCategories!.includes(channel.parentId):`,
      channel.parentId && config.excludedCategories!.includes(channel.parentId),
    );

    const logChannel = channel.guild.channels.cache.get(config.channelId);
    if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
      return;
    console.log(
      `🚀 ~ file: channelCreate.ts:28 ~ execute ~ !logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum:`,
      !logChannel,
    );

    await logChannel.send({
      embeds: [
        new Embed(Colors.Green).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[channel.type]} Channel Created**
                        ${channel} (#${channel.name})
                        `),
      ],
    });
  },
};
