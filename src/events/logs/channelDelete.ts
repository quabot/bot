import { Events, Colors, type GuildChannel, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.ChannelDelete,
  name: 'channelDelete',

  async execute({ client }: EventArgs, channel: GuildChannel) {
    if (!channel.guildId) return;

    const config = await getLoggingConfig(client, channel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('channelDelete')) return;
    if (channel.parentId && config.excludedCategories!.includes(channel.parentId)) return;
    if (config.excludedChannels!.includes(channel.id)) return;

    const logChannel = channel.guild.channels.cache.get(config.channelId);
    if (!logChannel || logChannel.type === ChannelType.GuildCategory || logChannel.type === ChannelType.GuildForum)
      return;

    await logChannel.send({
      embeds: [
        new Embed(Colors.Red).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[channel.type]} Channel Deleted**
                        #${channel.name}
                        `),
      ],
    });
  },
};
