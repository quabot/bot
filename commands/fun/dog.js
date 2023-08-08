const { messages } = require('dbots/lib/Utils/DBotsError');
const discord = require('discord.js');
const request = require('request');
const colors = require('../files/colors.json');

const noPermsAttachFiles = new discord.MessageEmbed()
    .setDescription("I do not have permission to attach files!")
    .setColor(colors.COLOR)
const errorMain = new discord.MessageEmbed()
    .setDescription("There was an error!")
    .setColor(colors.COLOR)

module.exports = {
    name: "dog",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `dog` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("ATTACH_FILES")) return message.channel.send(noPermsAttachFiles);

        request.get('http://thedogapi.com/api/images/get?format=src&type=png', {

        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // message.channel.send("There you go, a picture of a dog!");
                // message.channel.send(response.request.uri.href);
                const embed = new discord.MessageEmbed()
                    .setDescription("There you go, a picture of a dog!")
                    .setImage(response.request.uri.href)
                    .setColor(colors.COLOR);
                message.channel.send(embed);
            } else {
                message.channel.send(errorMain);
            }
        });
    }
}