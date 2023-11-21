import { Events, Colors, ThreadChannel, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.ThreadDelete,
  name: 'threadDelete',

  async execute({ client }: EventArgs, thread: ThreadChannel) {
    if (!thread.guild?.id) return;

    const config = await getLoggingConfig(client, thread.guildId);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('threadDelete')) return;
    if (
      thread.parentId &&
      ((thread.parent?.parentId && config.excludedCategories!.includes(thread.parent.parentId)) ||
        config.excludedChannels!.includes(thread.parentId))
    )
      return;

    const channel = thread.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Red).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[thread.type]} Deleted**
                        ${thread.name} - Parent: ${thread.parent}
                        **Created by:** <@${thread.ownerId}>
                        
                        `),
        ],
      })
      .catch(() => {});
  },
};
