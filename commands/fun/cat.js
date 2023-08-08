const { messages } = require('dbots/lib/Utils/DBotsError');
const discord = require('discord.js');
const request = require('request');
const colors = require('../../files/colors.json');

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)

module.exports = {
    name: "cat",
    aliases: [],
    async execute(client, message, args) {

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("ATTACH_FILES")) return message.channel.send(noPermsAttachFiles);

        console.log("Command `cat` was used.");
        request.get('http://thecatapi.com/api/images/get?format=src&type=png', {

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // message.channel.send("There you go, a picture of a cat!");
                // message.channel.send(response.request.uri.href);
                const embed = new discord.MessageEmbed()
                    .setDescription("There you go, a picture of a cat!")
                    .setImage(response.request.uri.href)
                    .setColor(colors.COLOR);
                message.channel.send(embed);
            } else {
                message.channel.send(errorMain);
            }
        });
    }
}