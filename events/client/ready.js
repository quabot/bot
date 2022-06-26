const consola = require('consola');
const { connect } = require('mongoose');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => console.error(err)).then((db) => consola.info(`Connected to database ${db.connections[0].name}.`))

        // set activity, database url and login msg

    }
}