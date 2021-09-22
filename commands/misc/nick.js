const discord = require('discord.js');
const colors = require('../../files/colors.json');

const errorEmbed = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":x: I do not have permission to change your nickname.")
const newNickEnter = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":point_right: Enter a new nickname to change to!")
const notAbove = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setTitle(":x: Failed to change your nickname! Make sure your highest role is below my highest role!")

module.exports = {
    name: "nick",
    aliases: ["changename"],
    async execute(client, message, args) {

        console.log("Command `nick` was used.");
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        if (!message.guild.me.permissions.has("MANAGE_NICKNAMES") || !message.guild.me.permissions.has("ADMINISTRATOR")) return message.channel.send(errorEmbed).then(message.delete({ timout: 10000 }));
        if (message.member.permissions.has('ADMINISTRATOR')) return message.channel.send({ embeds: [errorEmbed] }).then(message.delete({ timout: 10000 }));

        if (!args[0]) return message.channel.send({ embeds: [newNickEnter] });
        const newNick = args.slice(0).join(' ');
        message.member.setNickname(newNick).catch(err => {
            return message.channel.send({ embeds: [notAbove] })
        });

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        const change = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setTitle(`Changed your nickname to **${newNick}**!`)
        message.channel.send({ embeds: [change] });

    }
}