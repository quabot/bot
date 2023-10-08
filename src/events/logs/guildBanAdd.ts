const { Client, Events, GuildBan, Colors } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { Embed } from'@constants/embed');

module.exports = {
  event: Events.GuildBanAdd,
  name: 'guildBanAdd',
  /**
   * @param {GuildBan} ban
   * @param {Client} client
   */
  async execute(ban, client) {
    if (!ban.guild.id) return;

    const config = await getLoggingConfig(client, ban.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('guildBanAdd')) return;

    const channel = ban.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    await channel.send({
      embeds: [
        new Embed(Colors.Red)
          .setDescription(
            `
                        **Member Banned**
                        ${ban.user} (${ban.user.username})
                        `,
          )
          .setFooter({
            text: `${ban.user.username}`,
            iconURL: `${ban.user.displayAvatarURL({ forceStatic: false })}`,
          }),
      ],
    });
  },
};
