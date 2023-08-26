const { Client } = require('discord.js');
const Poll = require('@schemas/Poll');
const { getPollConfig } = require('../configs/pollConfig');
const { getServerConfig } = require('../configs/serverConfig');
const { Embed } = require('../constants/embed');

/**
 * @param {Client} client 
 */
async function endPoll(client, document) {

	const poll = await Poll.findOne({
		guildId: document.guildId,
		interaction: document.interaction
	});
	if (!poll) return;


	const guild = client.guilds.cache.get(poll.guildId);
	if (!guild) return;

	const channel = guild.channels.cache.get(poll.channel);
	if (!channel) return;


	const config = await getPollConfig(client, document.guildId);
	if (!config.enabled) return;

	const colorConfig = await getServerConfig(client, document.guildId);

	channel.messages
		.fetch(`${poll.message}`)
		.then(async message => {
			if (!message) return;

			const reactions = message.reactions.cache.each(async reaction => await reaction.users.fetch())
				.map(reaction => reaction.count)
				.flat();

			const winner = Math.max(...reactions);

			let winMsg;
			if (reactions[0] === winner) winMsg = poll.options[0];
			if (reactions[1] === winner) winMsg = poll.options[1];
			if (reactions[2] === winner) winMsg = poll.options[2];
			if (reactions[3] === winner) winMsg = poll.options[3];
			if (reactions[4] === winner) winMsg = poll.options[4];

			await message.edit({
				embeds: [
					new Embed(colorConfig.color)
						.setTitle(`${message.embeds[0].title}`)
						.setDescription(
							`${message.embeds[0].description}\n\nPoll is over, the poll was won by ${winMsg}!`
						)
						.addFields(
							{ name: 'Hosted by', value: `${message.embeds[0].fields[0].value}`, inline: true },
							{ name: 'Winner', value: `${winMsg}`, inline: true },
							{ name: 'Ended', value: `${message.embeds[0].fields[1].value}`, inline: true }
						)
				]
			});
		})
		.catch(() => { });

	await Poll.findOneAndDelete(poll);
}


module.exports = { endPoll };