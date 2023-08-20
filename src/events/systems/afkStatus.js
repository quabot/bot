const { Client, Message } = require('discord.js');
const { getUser } = require('@configs/user');
const { Embed } = require('@constants/embed');
const { getServerConfig } = require('@configs/serverConfig');

module.exports = {
	event: 'messageCreate',
	name: 'afkStatus',
	/**
	* @param {Message} message
    * @param {Client} client 
    */
	async execute(message, client) {
		const userId = message.author.id ?? '';
		if (!userId) return;
		if (message.author.bot) return;
		if (!message.guildId) return;

		const config = await getUser(message.guildId, userId);
		const configColor = await getServerConfig(client, message.guildId);
		const color = configColor?.color ?? '#416683';
		if (!config || !color) return;
        
		if (config.afk) {
			config.afk = false;
			config.save();

			message.reply({
				embeds: [
					new Embed(color)
						.setDescription('Removed your afk status!')
				]
			});
		}
	}
};