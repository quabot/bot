const { Client } = require('discord.js');
const Poll = require('@schemas/Poll');
const { endPoll } = require('../../utils/functions/poll');

module.exports = {
	event: 'ready',
	name: 'pollRestart',
	once: true,
	/**
     * @param {Client} client 
     */
	async execute(client) {
		const Polls = await Poll.find();

		Polls.forEach(async poll => {
			if (parseInt(poll.endTimestamp) < new Date().getTime()) {
				return await endPoll(client, poll);
			}

			const timeToPollEnd = parseInt(poll.endTimestamp) - new Date().getTime();
			setTimeout(async () => {
				await endPoll(client, poll);
			}, timeToPollEnd);
		});
	}
};