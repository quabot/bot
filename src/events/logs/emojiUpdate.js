const { Client, Events, GuildEmoji, Colors } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
	event: Events.GuildEmojiUpdate,
	name: 'emojiUpdate',
	/**
     * @param {GuildEmoji} oldEmoji
     * @param {GuildEmoji} newEmoji
     * @param {Client} client 
     */
	async execute(oldEmoji, newEmoji, client) {
		if (!newEmoji.guild.id) return;

		const config = await getLoggingConfig(client, oldEmoji.guild.id);
		if (!config) return;
		if (!config.enabled) return;

		if (!config.events.includes('emojiUpdate')) return;


		const channel = oldEmoji.guild.channels.cache.get(config.channelId);
		if (!channel) return;


		await channel.send({
			embeds: [
				new Embed(Colors.Yellow)
					.setDescription(`
                        **${newEmoji.animated ? 'Animated ' : ''}Emoji Edited**
                        ${oldEmoji.name} -> ${newEmoji.name} - [Full image](${newEmoji.url})
                        `)
					.setFooter({ text: `${newEmoji.name}`, iconURL: `${newEmoji.url}` })
			]
		});
	}
};