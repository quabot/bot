const consola = require('consola');
const { connect } = require('mongoose');
const { Client } = require('discord.js');
require('dotenv').config();
const { AutoPoster } = require('topgg-autoposter');

module.exports = {
    event: "ready",
    name: "clientConnections",
    once: true,
    /**
     * @param {Client} client
     */
    async execute(client) {

        connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => console.error(err)).then((db) => consola.info(`Connected to database ${db.connections[0].name}.`))

        const poster = AutoPoster("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk5NTI0MzU2MjEzNDQwOTI5NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjY0MzUzNDI1fQ.i_bNj3MFy0EZtxCRzfvjlqDacXfue4c3TWhf8Z_W0ic", client);
        poster.on('posted', (stats) => {
            console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);
        })

    }
}