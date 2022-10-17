const { Client } = require('discord.js');
const { endGiveaway } = require('../../structures/functions/guilds');

module.exports = {
    event: 'ready',
    name: 'giveawayRestart',
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {
        const Giveaway = require('../../structures/schemas/GiveawaySchema');
        const Giveaways = await Giveaway.find();

        Giveaways.forEach(async giveaway => {
            if (giveaway.ended === true) return;
            if (parseInt(giveaway.endTimestamp) < new Date().getTime()) {
                return await endGiveaway(client, giveaway, '#3a5a74');
            }

            const timeToGiveawayEnd = parseInt(giveaway.endTimestampRaw) - new Date().getTime();
            setTimeout(async () => {
                await endGiveaway(client, giveaway, '#3a5a74');
            }, timeToGiveawayEnd);
        });
    },
};
