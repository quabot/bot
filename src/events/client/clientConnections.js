const consola = require('consola');
const { connect } = require('mongoose');
const { Client } = require('discord.js');
require('dotenv').config();

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
        }).catch((err) => console.error(err)).then((db) => consola.success(`Connected to database ${db.connections[0].name}.`))
        
        //topgg poster

    }
}