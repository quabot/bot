const discord = require('discord.js');
const colors = require('../../files/colors.json');
const { SupportEmbed } = require('../../files/embeds');

module.exports = {
    name: "support",
    aliases: ["discord"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        message.channel.send({ embeds: [SupportEmbed]});
    }
}