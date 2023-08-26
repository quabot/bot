const { Client, Events } = require('discord.js');
const { execute } = require('./messageDelete');

module.exports = {
	event: Events.MessageBulkDelete,
	name: 'messageDeleteBulk',
	/**
     * @param {Client} client 
     */
	async execute(messages, channel, client) {
		if (!channel.guild.id) return;

		messages.forEach(m => execute(m, client));		
	}
};