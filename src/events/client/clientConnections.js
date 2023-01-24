const { Client } = require('discord.js');
const { connect, set } = require('mongoose');
const consola = require('consola');
const { AutoPoster } = require('topgg-autoposter');

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

        if (process.env.NODE_ENV !== 'production') return;
        AutoPoster(process.env.TOPGG_API_KEY ?? '', client).on('posted', stats =>
            consola.info(`Published statistics: ${stats.serverCount} servers.`)
        );
    }
}