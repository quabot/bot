const { Client } = require('discord.js');
const { endGiveaway } = require('../../utils/functions/giveaway');

module.exports = {
	event: 'ready',
	name: 'giveawayRestart',
	once: true,
	/**
     * @param {Client} client 
     */
	async execute(client) {
		const Giveaway = require('@schemas/Giveaway');
		const giveaways = await Giveaway.find({ ended: false });

		giveaways.forEach(async giveaway => {
			if (parseInt(giveaway.endTimestamp) < new Date().getTime()) {
				return await endGiveaway(client, giveaway);
			}

			const timeToGiveawayEnd = parseInt(giveaway.endTimestamp) - new Date().getTime();
			setTimeout(async () => {
				await endGiveaway(client, giveaway, false);
			}, timeToGiveawayEnd);
		});
	}
};