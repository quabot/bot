const { Client, Events, Colors, GuildChannel } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { channelTypesById } from'@constants/discord');
const { Embed } from'@constants/embed');

module.exports = {
  event: Events.ChannelDelete,
  name: 'channelDelete',
  /**
   * @param {GuildChannel} channel
   * @param {Client} client
   */
  async execute(channel, client) {
    if (!channel.guildId) return;

    const config = await getLoggingConfig(client, channel.guildId);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('channelDelete')) return;
    if (channel.parentId && config.excludedCategories.includes(channel.parentId)) return;
    if (config.excludedChannels.includes(channel.id)) return;

    const logChannel = channel.guild.channels.cache.get(config.channelId);
    if (!logChannel) return;

    await logChannel.send({
      embeds: [
        new Embed(Colors.Red).setDescription(`
                        **${channelTypesById[channel.type]} Channel Deleted**
                        #${channel.name}
                        `),
      ],
    });
  },
};
