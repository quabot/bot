const { Client, Events, Colors, GuildChannel } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { channelTypesById } = require('../../utils/constants/discord');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.ChannelDelete,
    name: "channelDelete",
    /**
     * @param {GuildChannel} channel
     * @param {Client} client 
     */
    async execute(channel, client) {

        const config = await getLoggingConfig(client, channel.guildId);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('channelDelete')) return;
        if (channel.parentId && config.excludedCategories.includes(channel.parentId)) return;
        if (config.excludedChannels.includes(channel.id)) return;


        const logChannel = channel.guild.channels.cache.get(config.channelId);
        if (!logChannel) return;
        
        await logChannel.send({
            embeds: [
                new Embed(Colors.Red)
                    .setDescription(`
                        **${channelTypesById[channel.type]} Channel Deleted**
                        #${channel.name}
                        `)
            ]
        });
    }
}