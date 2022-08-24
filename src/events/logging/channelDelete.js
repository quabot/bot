const { GuildChannel, Client, EmbedBuilder, Colors } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');
const channelTypes = ["Text channel", "DM", "Voice Channel", "DM", "Category", "News Channels", "News Thread", "Thread", "Private Thread", "Stage Channel", "Directory Channel", "Forum Channel"];

module.exports = {
    event: "channelDelete",
    name: "channelDelete",
    /**
     * @param {GuildChannel} channel
     * @param {Client} client
     */
    async execute(channel, client, color) {

        if (!channel.guildId) return;

        const logConfig = await getLogConfig(client, channel.guildId);
        if (!logConfig) return;

        const logChannel = await getLogChannel(channel.guild, logConfig);
        if (!logChannel) return;

        logChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(Colors.Green)
                    .setDescription(`**${channelTypes[channel.type]} Created**\n${channel}`)
                    .setFooter({ text: `Channel Name: ${channel.name}` })
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}