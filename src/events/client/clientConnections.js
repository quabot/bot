const { Client } = require('discord.js');
const { connect, set } = require('mongoose');
const consola = require('consola');
const { AutoPoster } = require('topgg-autoposter');
const axios = require('axios');
const { API_URL } = require('../../utils/constants/discord');

module.exports = {
    event: "ready",
    name: "clientConnections",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        set('strictQuery', true);

        connect(process.env.DATABASE_URI)
            .then(db => {
                consola.info(`Connected to database ${db.connections[0].name}.`);
            })
            .catch(err => {
                consola.error(`Failed to connect to the database: ${err}`);
            });

        // Website stats
        (function loop() {
            setTimeout(function () {
                axios.post(`${API_URL}/site/set-stats`, { servers: client.guilds.cache.size, channels: client.channels.cache.size, users: client.users.cache.size }, {
                    headers: {
                        authorization: process.env.STATS_KEY
                    }
                });
                loop();
            }, 60000);
        })();

        if (process.env.NODE_ENV !== 'production') return;
        AutoPoster(process.env.TOPGG_API_KEY ?? '', client).on('posted', stats =>
            consola.info(`Published statistics: ${stats.serverCount} servers.`)
        );
    }
}