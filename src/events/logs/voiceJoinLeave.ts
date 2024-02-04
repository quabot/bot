import { Events, Colors, VoiceState } from 'discord.js';
import { getLoggingConfig } from '@configs/loggingConfig';
import { Embed } from '@constants/embed';
import type { EventArgs } from '@typings/functionArgs';
import { hasSendPerms } from '@functions/discord';

export default {
  event: Events.VoiceStateUpdate,
  name: 'voiceJoinLeave',

  async execute({ client }: EventArgs, oldState: VoiceState, newState: VoiceState) {
    if (!newState.guild.id) return;

    if (oldState.member?.user.bot || newState.member?.user.bot) return;

    const config = await getLoggingConfig(client, oldState.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events!.includes('voiceJoinLeave')) return;
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
    if (!channel?.isTextBased()) return;
    if (!hasSendPerms(channel)) return;

    if (oldState.channelId && newState.channelId) return;
    if (!oldState.channelId) {
      await channel
        .send({
          embeds: [
            new Embed(Colors.Green).setDescription(
              `**Voice Channel Joined**\n${newState.member} joined ${newState.channel}`,
            ),
          ],
        })
        .catch(() => {});
    } else {
      await channel
        .send({
          embeds: [
            new Embed(Colors.Red).setDescription(`**Voice Channel Left**\n${newState.member} left ${oldState.channel}`),
          ],
        })
        .catch(() => {});
    }
  },
};
