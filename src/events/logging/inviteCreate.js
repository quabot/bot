const { Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: 'inviteCreate',
    name: 'inviteCreate',
    /**
     * @param {Client} client
     */
    async execute(invite, client, color) {
        if (!invite.guild) return;

        const logConfig = await getLogConfig(client, invite.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(invite.guild, logConfig);
        if (!logChannel) return;

        if (logConfig.logExcludedChannels && logConfig.logExcludedChannels.includes(invite.channel.id)) return;
        if (logConfig.logExcludedCategories && invite.channel.parentId && logConfig.logExcludedCategories.includes(invite.channel.parentId)) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(
                            `**Invite Created**\n[discord.gg/${invite.code}](https://discord.gg/${invite.code})\n${
                                invite.inviter
                            } - ${invite.channel}\n\n**Expires after:**\n${invite.maxAge / 60 / 60} hours`
                        )
                        .setColor(Colors.Green)
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
