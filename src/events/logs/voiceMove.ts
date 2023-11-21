import { Events, Colors, VoiceState, ChannelType } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';

export default {
  event: Events.VoiceStateUpdate,
  name: 'voiceMove',

  async execute({ client }: EventArgs, oldState: VoiceState, newState: VoiceState) {
    if (!newState.guild.id) return;

    if (oldState.member?.user.bot || newState.member?.user.bot) return;

    const config = await getLoggingConfig(client, oldState.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (
      oldState.streaming !== newState.streaming ||
      oldState.suppress !== newState.suppress ||
      oldState.selfVideo !== newState.selfVideo ||
      oldState.selfMute !== newState.selfMute ||
      oldState.selfDeaf !== newState.selfDeaf
    )
      return;
    if (oldState.serverDeaf !== newState.serverDeaf || oldState.serverMute !== newState.serverMute) return;

    if (
      newState.channelId &&
      ((newState.channel?.parentId && config.excludedCategories!.includes(newState.channel.parentId)) ||
        config.excludedChannels!.includes(newState.channelId))
    )
      return;
    if (
      oldState.channelId &&
      ((oldState.channel?.parentId && config.excludedCategories!.includes(oldState.channel.parentId)) ||
        config.excludedChannels!.includes(oldState.channelId))
    )
      return;

    const channel = newState.guild.channels.cache.get(config.channelId);
    if (!channel || channel.type === ChannelType.GuildCategory || channel.type === ChannelType.GuildForum) return;

    if (!oldState.channelId || !newState.channelId) return;

    await channel
      .send({
        embeds: [
          new Embed(Colors.Yellow).setDescription(
            `**User Moved**\n${newState.member} switched from ${oldState.channel} to ${newState.channel}`,
          ),
        ],
      })
      .catch(() => {});
  },
};
