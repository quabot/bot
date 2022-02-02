const Discord = require('discord.js');
const colors = require('../../files/colors.json');

const { errorMain } = require('../../files/embeds.js')
module.exports = {
    name: "debug",
    economy: true,
    aliases: ["developer-cmd"],
    cooldown: "5",
    async execute(client, message, args) {

        if (message.author.id === "486563467810308096") {

            message.delete();

            if (!args[0]) return message.channel.send("Valid debug args are:\n**servers-console**\n**servers**\n**errormsg**");

            if (args[0] === "servers-console") {
                console.log("QUABOT DISCORD SERVERS:")
                client.guilds.cache.forEach(guild => {
                    console.log(`${guild.name} | ${guild.id}`);
                    return
                })
            }

            if (args[0] === "servers") {
                message.channel.send("**Quabot discord servers:**")
                client.guilds.cache.forEach(guild => {
                    message.channel.send(`${guild.name} | ${guild.id}`);
                    return
                })
            }

            if (args[0] === "errormsg") {
                message.channel.send({ embeds: [errorMain] });
            }
            return;

        } else {
            return message.channel.send("Only developers can use debug commands.");
        }

    }
}

