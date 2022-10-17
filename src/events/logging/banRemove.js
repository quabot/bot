const { Client, EmbedBuilder, Colors, GuildBan } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: 'guildBanRemove',
    name: 'banRemove',
    /**
     * @param {GuildBan} ban
     * @param {Client} client
     */
    async execute(ban, client, color) {
        if (!ban.guild) return;

        const logConfig = await getLogConfig(client, ban.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(ban.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Green)
                        .setDescription(`**Member Unbanned**\n\`${ban.user.tag}\``)
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
