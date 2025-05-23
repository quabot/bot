import { Events, Colors, type GuildChannel } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.ChannelCreate,
  name: 'channelCreate',

  async execute({ client }: EventArgs, channel: GuildChannel) {
    if (!channel.guildId) return;

    const config = await getLoggingConfig(client, channel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'channelCreate');
    if (!event) return;

    if (!event.enabled) return;
    if (channel.parentId && config.excludedCategories!.includes(channel.parentId)) return;

    const logChannel = channel.guild.channels.cache.get(event.channelId);
    if (!logChannel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await logChannel
      .send({
        embeds: [
          new Embed(Colors.Green).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[channel.type]} Channel Created**
                        ${channel} (#${channel.name})
                        `),
        ],
      })
      .catch(() => {});
  },
};
