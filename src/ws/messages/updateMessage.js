const { CustomEmbed } = require('../../utils/constants/customEmbed');

//* QuaBot Staff Update Message Sender.
module.exports = {
	code: 'update-message',
	async execute(client, data) {

		//* Get the message and prepare for CE.
		const message = data.message;
		if (!message) return;

		const getParsedString = (s) => {
			return s;
		};

		//* Send the embed to all servers.
		const sentEmbed = new CustomEmbed(message, getParsedString);
		let total = 0;
		client.guilds.cache.forEach(async (guild) => {
			const Server = require('../../structures/schemas/Server');
			const config = await Server.findOne({ guildId: guild.id });
			if (config) {
				const channel = guild.channels.cache.get(config.updatesChannel);
				if (channel) {
					total++;
					channel.send({ embeds: [sentEmbed] });
					console.log('Sent the update message to ' + guild.name + ' (' + guild.id + ')');
				}
			}

		});
	}
};