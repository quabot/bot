const config = require('../../files/settings.json');
const mongoose = require('mongoose');
const consola = require('consola');
const Discord = require('discord.js');

module.exports = {
    name: "messageCreate",
    /**
     * @param {Client} client 
     */
    async execute(message, client) {


        try {
            const guildId = message.guild.id;

            if (guildId === null) return;
            const prefix = "!";

            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();

            const command = client.commands.get(cmd) ||
                client.commands.find(a => a.aliases && a.aliases.includes(cmd));;

            if (command) command.execute(client, message, args);


        } catch (e) {
            return;
        }

    }
}