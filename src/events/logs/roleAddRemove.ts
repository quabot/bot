const { Client, Events, Colors, GuildMember } from'discord.js');
const { getLoggingConfig } from'@configs/loggingConfig');
const { Embed } from'@constants/embed');

module.exports = {
  event: Events.GuildMemberUpdate,
  name: 'roleAddRemove',
  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @param {Client} client
   */
  async execute(oldMember, newMember, client) {
    try {
      if (!newMember.guild.id) return;
    } catch (e) {
      // no
    }

    const config = await getLoggingConfig(client, oldMember.guild.id);
    if (!config) return;
    if (!config.enabled) return;

    if (!config.events.includes('roleAddRemove')) return;

    if (oldMember.nickname !== newMember.nickname) return;
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) return;
    if (oldMember.premiumSinceTimestamp !== newMember.premiumSinceTimestamp) return;
    if (oldMember.avatar !== newMember.avatar) return;

    const channel = oldMember.guild.channels.cache.get(config.channelId);
    if (!channel) return;

    let role;
    if (oldMember._roles < newMember._roles)
      role = `<@&${newMember._roles.filter(n => !oldMember._roles.includes(n)).join('>\n<@&')}>`;
    if (oldMember._roles > newMember._roles)
      role = `<@&${oldMember._roles.filter(n => !newMember._roles.includes(n)).join('>\n<@&')}>`;

    if (role === '<@&>') return;
    if (!role) return;

    await channel.send({
      embeds: [
        new Embed(oldMember._roles.length > newMember._roles.length ? Colors.Red : Colors.Green)
          .setDescription(
            `
                        **Role(s) ${oldMember._roles.length > newMember._roles.length ? 'Removed' : 'Given'}**
                        **User:** ${newMember}
                        ${role}
                        `,
          )
          .setFooter({
            text: `${newMember.user.username}`,
            iconURL: `${newMember.user.displayAvatarURL({ forceStatic: false })}`,
          }),
      ],
    });
  },
};
