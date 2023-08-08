const discord = require('discord.js');
const colors = require('../files/colors.json');

const noPermsMsg = new discord.MessageEmbed()
    .setDescription("I do not have permission to manage messages!")
    .setColor(colors.COLOR);
const noResponse = new discord.MessageEmbed()
    .setDescription("Please react with `rock, paper or scissors`!")
    .setColor(colors.COLOR);
const resultTie = new discord.MessageEmbed()
    .setDescription("It's a tie!")
    .setColor(colors.COLOR);
const youWin = new discord.MessageEmbed()
    .setDescription("You won!")
    .setColor(colors.COLOR);
const youLost = new discord.MessageEmbed()
    .setDescription("You lost!")
    .setColor(colors.COLOR);

module.exports = {
    name: "rps",
    aliases: [],
    async execute(client, message, args) {

        console.log("Command `rps` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(noPermsMsg);

        const acceptedReplies = ['rock', 'paper', 'scissors'];
        const random = Math.floor((Math.random() * acceptedReplies.length));
        const result = acceptedReplies[random];

        const choice = args[0];
        if (!choice) return message.channel.send(noResponse);
        if (!acceptedReplies.includes(choice)) return message.channel.send(noResponse);

        if (result === choice) return message.channel.send(resultTie);

        switch (choice) {
            case 'rock': {
                if (result === 'paper') return message.channel.send(youLost);
                else return message.channel.send(youWin);
            }
            case 'paper': {
                if (result === 'scissors') return message.channel.send(youLost);
                else return message.channel.send(youWin);
            }
            case 'scissors': {
                if (result === 'rock') return message.channel.send(youLost);
                else return message.channel.send(youWin);
            }
            default: {
                return message.channel.send(noResponse);
            }
        }

    }
}