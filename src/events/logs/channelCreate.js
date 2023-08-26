const { Client, Events, Colors, GuildChannel } = require('discord.js');
const { getLoggingConfig } = require('@configs/loggingConfig');
const { channelTypesById } = require('@constants/discord');
const { Embed } = require('@constants/embed');

module.exports = {
	event: Events.ChannelCreate,
	name: 'channelCreate',
	/**
     * @param {GuildChannel} channel
     * @param {Client} client 
     */
	async execute(channel, client) {
		if (!channel.guildId) return;

		const config = await getLoggingConfig(client, channel.guildId);
		if (!config) return;
		if (!config.enabled) return;

		if (!config.events.includes('channelCreate')) return;
		if (channel.parentId && config.excludedCategories.includes(channel.parentId)) return;


		const logChannel = channel.guild.channels.cache.get(config.channelId);
		if (!logChannel) return;
        
		await logChannel.send({
			embeds: [
				new Embed(Colors.Green)
					.setDescription(`
                        **${channelTypesById[channel.type]} Channel Created**
                        ${channel} (#${channel.name})
                        `)
			]
		});
	}
};