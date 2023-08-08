const discord = require('discord.js');
const colors = require('../files/colors.json');

const errorEmbed = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("I do not have permission to change your nickname.")
const newNickEnter = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Enter a new nickname to change to!")
const notAbove = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Failed to change your nickname! Make sure your highest role is below my highest role!")

module.exports = {
    name: "nick",
    aliases: ["changename"],
    async execute(client, message, args) {

        console.log("Command `nick` was used.");
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_NICKNAMES") || !message.guild.me.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed).then(message.delete({ timout: 10000 }));
        if (message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(errorEmbed).then(message.delete({ timout: 10000 }));

        if (!args[0]) return message.channel.send(newNickEnter);
        const newNick = args.slice(0).join(' ');
        message.member.setNickname(newNick).catch(err => {
            return message.channel.send(notAbove)
        });

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        const change = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setDescription(`Changed your nickname to **${newNick}**!`)
        message.channel.send("Succesfully changed your nickname.");

    }
}