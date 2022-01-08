const config = require('../../files/config.json');
const mongoose = require('mongoose');
const consola = require('consola');
const Discord = require('discord.js');

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client 
     */
    async execute(message, client) {
        const guildId = message.guild.id;

        if (guildId === null) return;

        try {

            const prefix = "!";

            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();

            const command = client.commands.get(cmd) ||
                client.commands.find(a => a.aliases && a.aliases.includes(cmd));;

            if (command) return message.channel.send(":money_with_wings: Economy is coming to quabot soon!");//command.execute(client, message, args)


        } catch (e) {
            console.log(e);
            return;
        }

    }
};