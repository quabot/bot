const { Client, Events, GuildBan, Colors } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  event: Events.GuildBanRemove,
  name: 'guildBanRemove',
  /**
   * @param {GuildBan} ban
   * @param {Client} client
   */
  async execute(ban, client) {
    if (!ban.guild.id) return;

    const config = await getLoggingConfig(client, ban.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('guildBanRemove')) return;

    const channel = ban.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
      embeds: [
        new Embed(Colors.Green)
          .setDescription(
            `
                        **Member Unbanned**
                        ${ban.user} (${ban.user.username})
                        `,
          )
          .setFooter({
            text: `${ban.user.username}`,
            iconURL: `${ban.user.displayAvatarURL({ dynamic: true })}`,
          }),
      ],
    });
  },
};
