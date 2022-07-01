const consola = require('consola');
const { connect } = require('mongoose');
const { CMD_AMOUNT } = require('../../structures/settings.json');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => console.error(err)).then((db) => consola.info(`Connected to database ${db.connections[0].name}.`))

        function setActivity(status) { client.user.setActivity(status, { type: "WATCHING" }); }
        (function loop() {
            setTimeout(function () { setActivity(`${client.users.cache.size} users |  /help`) }, 6000);
            setTimeout(function () { setActivity(`quabot.net | /help`) }, 12000);
            setTimeout(function () { setActivity(`${CMD_AMOUNT} commands | /help`) }, 18000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop()
            }, 24000);
        }());

        consola.success(`Logged in as ${client.user.tag}`);

        if (client.user.username !== "QuaBot") consola.warn("You are not logged in as QuaBot.")

    }
}