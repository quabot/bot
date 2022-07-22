const consola = require('consola');
const { ActivityType } = require('discord.js');
const { connect } = require('mongoose');
const { TESTING } = require('../../structures/settings.json');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {

        connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => console.error(err)).then((db) => consola.info(`Connected to database ${db.connections[0].name}.`))

        function setActivity(status) {
            client.user.setActivity({
                type: ActivityType.Watching,
                name: `${status}`,
            });
        }
        (function loop() {
            setTimeout(function () { setActivity(`${client.users.cache.size} users |  /help`) }, 6000);
            setTimeout(function () { setActivity(`quabot.net | /help`) }, 12000);
            setTimeout(function () { setActivity(`${client.commands.size} commands | /help`) }, 18000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop()
            }, 24000);
        }());

        consola.success(`Logged in as ${client.user.tag}`);

        if (TESTING) consola.info(`Testing mode enabled. This is not recommended for stable since it will spam warnings.`);

        if (client.user.username !== "QuaBot" && !TESTING) consola.warn("You are not logged in as QuaBot.");

        if (client.user.username !== "QuaBot Testing" && TESTING) consola.warn("You are not logged in as QuaBot Testing.");

        if (!TESTING) {
            const { AutoPoster } = require('topgg-autoposter');
            const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0NTYwMzcwMjIxMDk1MzI0NiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjQxMzAwNTQxfQ.MhZPKVmJ2RgoWVZ1x5ADwZZI0oMt2Aa2Z_sjDC_QzXY', client);

            poster.on('posted', (stats) => {
                console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
            });
        }
    }
}