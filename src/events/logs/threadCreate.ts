import { Events, Colors, ThreadChannel } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import { CHANNEL_TYPES_BY_ID } from '@constants/discord';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.ThreadCreate,
  name: 'threadCreate',

  async execute({ client }: EventArgs, thread: ThreadChannel) {
    if (!thread.guild.id) return;

    const config = await getLoggingConfig(client, thread.guildId);
    if (!config) return;
    if (!config.enabled) return;

    const event = config.events?.find(event => event.event === 'threadCreate');
    if (!event) return;

    if (!event.enabled) return;
    if (
      thread.parentId &&
      ((thread.parent?.parentId && config.excludedCategories!.includes(thread.parent.parentId)) ||
        config.excludedChannels!.includes(thread.parentId))
    )
      return;

    const channel = thread.guild.channels.cache.get(event.channelId);
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Green).setDescription(`
                        **${CHANNEL_TYPES_BY_ID[thread.type]} Created**
                        ${thread.name} - ${thread}
                        **Created by:** <@${thread.ownerId}>
                        
                        `),
        ],
      })
      .catch(() => {});
  },
};
