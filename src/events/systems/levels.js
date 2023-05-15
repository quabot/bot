const { Client, Message } = require('discord.js');

module.exports = {
    event: "messageCreate",
    name: "levels",
    /**
	* @param {Message} message
    * @param {Client} client 
    */
    async execute(message, client) {
			if (!message.guildId) return;
			if (message.author.bot) return;

			// check if no cooldown
			// check if module enabled
			// check if channels/roles allowed
			// get user w/ level
			// get xp
			// get xp based on msg length
			// get reqxp
			// check if new level
			// if lvl send msg and apply else dont apply
			// levelup msg
			// levelup rewards
    }
}