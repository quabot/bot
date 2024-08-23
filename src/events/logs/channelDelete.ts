import { Events, Colors, type GuildChannel } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.ChannelDelete,
  name: 'channelDelete',

  async execute({ client }: EventArgs, channel: GuildChannel) {
    if (!channel.guildId) return;

    const config = await getLoggingConfig(client, channel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'channelDelete');
    if (!event) return;

    if (!event.enabled) return;
    if (channel.parentId && config.excludedCategories!.includes(channel.parentId)) return;
    if (config.excludedChannels!.includes(channel.id)) return;

    const logChannel = channel.guild.channels.cache.get(event.channelId);
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(logChannel)) return;

    await logChannel
      .send({
        embeds: [
          new Embed(Colors.Red).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[channel.type]} Channel Deleted**
                        #${channel.name}
                        `),
        ],
      })
      .catch(() => {});
  },
};
