const config = require('../../files/config.json');
const mongoose = require('mongoose');
const consola = require('consola');

module.exports = {
    name: "guildDelete",
    /**
     * @param {Client} client 
     */
    async execute(guild, client) {
        consola.log(" ");
        consola.info("QUABOT REMOVED")
        consola.info(`QuaBot has been removed from: ${guild.name}\nMembers: ${guild.memberCount}`);
    }
};