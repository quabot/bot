const { Client } = require('discord.js');
const { endPoll } = require('../../structures/functions/guilds');

module.exports = {
    event: "ready",
    name: "pollRestart",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {

        const Poll = require('../../structures/schemas/PollSchema');
        const Polls = await Poll.find();

        Polls.forEach(async poll => {
            if (parseInt(poll.endTimestamp) < new Date().getTime()) { return await endPoll(client, poll, "#3a5a74"); }

            const timeToPollEnd = parseInt(poll.endTimestamp) - new Date().getTime();
            setTimeout(async () => {
                await endPoll(client, poll, "#3a5a74");
            }, timeToPollEnd);
        });
    }
}