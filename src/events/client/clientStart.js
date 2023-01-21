const { ActivityType, Client } = require("discord.js");

module.exports = {
    event: "ready",
    name: "clientStart",
    /**
     * @param {Client} client 
     */
    async execute(client) {
        function setActivity(activity) {
            client.user.setActivity({ type: ActivityType.Watching, name: activity });
        }
        (function loop() {
            setTimeout(function () { setActivity(`${client.commands.size} commands | /help`) }, 6000);
            setTimeout(function () { setActivity(`${client.users.cache.size.toLocaleString()} users |  /help`) }, 12000);
            setTimeout(function () { setActivity(`quabot.net |  /help`) }, 18000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop();
            }, 24000);
        })();

        consola.info(`Logged in as ${client.user.tag}.`);
    }
}