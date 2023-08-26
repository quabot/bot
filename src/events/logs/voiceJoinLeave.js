const { Client, Events, Colors, ThreadChannel, VoiceState } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { Embed } = require('@constants/embed');
const { channelTypesById } = require('@constants/discord');

module.exports = {
  event: Events.VoiceStateUpdate,
  name: 'voiceJoinLeave',
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {Client} client
   */
  async execute(oldState, newState, client) {
    try {
      if (!newState.guild.id) return;
    } catch (e) {
      // no
    }

    if (oldState.member.user.bot || newState.member.user.bot) return;

    const config = await getLoggingConfig(client, oldState.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('voiceJoinLeave')) return;
    if (
      newState.channelId &&
      (config.excludedCategories.includes(newState.channel.parentId) ||
        config.excludedChannels.includes(newState.channelId))
    )
      return;
    if (
      oldState.channelId &&
      (config.excludedCategories.includes(oldState.channel.parentId) ||
        config.excludedChannels.includes(oldState.channelId))
    )
      return;

    const channel = newState.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    if (oldState.channelId && newState.channelId) return;
    if (!oldState.channelId) {
      await channel.send({
        embeds: [
          new Embed(Colors.Green).setDescription(
            `**Voice Channel Joined**\n${newState.member} joined ${newState.channel}`,
          ),
        ],
      });
    } else {
      await channel.send({
        embeds: [
          new Embed(Colors.Red).setDescription(`**Voice Channel Left**\n${newState.member} left ${oldState.channel}`),
        ],
      });
    }
  },
};
