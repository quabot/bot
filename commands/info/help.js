const discord = require('discord.js');
const { HelpMain } = require('../../files/embeds');
const { HelpSelect } = require('../../files/interactions');


module.exports = {
    name: "help",
    aliases: ["commands", "command"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        message.channel.send({ embeds: [HelpMain], components: [HelpSelect] });
    }
}