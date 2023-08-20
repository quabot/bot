const { CustomEmbed } = require('../../utils/constants/customEmbed');

//* QuaBot Dashboard Message Sender Handler.
module.exports = {
	code: 'send-message',
	async execute(client, data) {
       
		//* Get the guild and channel.
		const guild = client.guilds.cache.get(data.guildId);
		if (!guild) return;
		const channel = guild.channels.cache.get(data.channelId);
		const embed = data.embed;
		if (!channel) return;


		//* Send the message.
		const getParsedString = (s) => {
			return `${s}`.replaceAll('{guild}', guild.name).replaceAll('{members}', guild.memberCount);
		};

		const sentEmbed = new CustomEmbed(data.message, getParsedString);
		if (embed) await channel.send({ embeds: [sentEmbed], content: getParsedString(data.message.content) ?? '' });
		if (!embed && (getParsedString(data.message.content) ?? '** **') !== '') await channel.send({ content: getParsedString(data.message.content) ?? '** **' });

	}
};