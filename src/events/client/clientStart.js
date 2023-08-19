const { ActivityType, Client } = require("discord.js");

module.exports = {
    event: "ready",
    name: "clientStart",
    once: true,
    /**
     * @param {Client} client 
     */
    async execute(client) {
        client.guilds.cache.forEach(guild => guild.members.fetch().catch(() => { }));

        function setActivity(activity) {
            client.user.setActivity({ type: ActivityType.Watching, name: activity });
        }
        (function loop() {
            setTimeout(function () { setActivity(`${client.commands.size} commands | /help`) }, 10000);
            setTimeout(function () { setActivity(`${client.users.cache.size.toLocaleString()} users |  /help`) }, 20000);
            setTimeout(function () { setActivity(`quabot.net |  /help`) }, 30000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop();
            }, 40000);
        })();

        consola.info(`Logged in as ${client.user.tag}.`);
    }
}