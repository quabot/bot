const { CMD_AMOUNT } = require('../../structures/settings.json');
const { connect } = require('mongoose');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        function setActivity(status) { client.user.setActivity(status, { type: "WATCHING" }); }
        (function loop() {
            setTimeout(function () { setActivity(`${client.users.cache.size} users |  /help`) }, 6000);
            setTimeout(function () { setActivity(`quabot.net | /help`) }, 12000);
            setTimeout(function () { setActivity(`${CMD_AMOUNT} commands | /help`) }, 18000);
            setTimeout(function () { setActivity(`Rewrite 1% | /help`) }, 24000);
            setTimeout(function () {
                setActivity(`${client.guilds.cache.size} servers |  /help`);
                loop()
            }, 30000);
        }());

        connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).catch((err) => console.error(err));

        client.guilds.cache.get('957024489638621185').channels.cache.get('957210942674972682').send({ embeds: [new MessageEmbed().setDescription(`**${client.user.username}** has been restarted.`)] }).catch(( err => { } ))

        consola.success("Ready");

    }
}