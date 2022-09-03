const consola = require('consola');
const { Client, ActivityType } = require('discord.js');
const { tempUnban } = require('../../structures/functions/guilds');

module.exports = {
    event: "ready",
    name: "clientStart",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {

        const TempBan = require('../../structures/schemas/TempbanSchema');
        const Bans = await TempBan.find();

        Bans.forEach(async ban => {
            if (parseInt(ban.unbanTime) < new Date().getTime) { return await tempUnban(client, ban, "#3a5a74"); }

            const timeToUnban = parseInt(ban.unbanTime) - new Date().getTime();
            setTimeout(async () => {
                await tempUnban(client, ban, "#3a5a74");
            }, timeToUnban);
        });
    }
}