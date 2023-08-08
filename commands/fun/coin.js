const discord = require('discord.js');

const Flipping = require('../../files/embeds');
const colors = require('../files/colors.json');

module.exports = {
    name: "coin",
    aliases: ["coinflip"],
    async execute(client, message, args) {

        console.log("Command `coin` was used.");

        if (message.guild.me.hasPermission("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

        function randomCoin() {
            const random = ['You got heads', 'You got tails'];
            return random[Math.floor(Math.random() * random.length)];        
        }

        const Result = new discord.MessageEmbed()
            .setDescription(`**${randomCoin()}**!`)
            .setColor(colors.COLOR)

        message.channel.send(Flipping).then(msg => {
            setTimeout(function () {
                msg.edit(Result);
            }, 2000);
        });
    }
}