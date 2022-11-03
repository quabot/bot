const { GuildChannel, Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');
const channelTypes = [
    'Text channel',
    'DM',
    'Voice Channel',
    'DM',
    'Category',
    'News Channel',
    'News Thread',
    'Thread',
    'Private Thread',
    'Stage Channel',
    'Directory Channel',
    'Forum Channel',
];

module.exports = {
    event: 'channelDelete',
    name: 'channelDelete',
    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */
    async execute(channel, client, color) {
        if (!channel.guildId) return;

        const logConfig = await getLogConfig(client, channel.guildId);
        if (!logConfig) return;
        if (logConfig.logEnabled === false) return;

        if (logConfig.logExcludedChannels && logConfig.logExcludedChannels.includes(channel.id)) return;
        if (logConfig.logExcludedCategories && channel.parentId && logConfig.logExcludedCategories.includes(channel.parentId)) return;

        const logChannel = await getLogChannel(channel.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.event)) return;

        logChannel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`**${channelTypes[channel.type]} Deleted**\n\`${channel.name}\``)
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
