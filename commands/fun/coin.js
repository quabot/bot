const discord = require('discord.js');
const colors = require('../../files/colors.json');

const Flipping = new discord.MessageEmbed()
    .setColor(colors.COLOR)
    .setDescription("Tossing the coin... :coin:")

module.exports = {
    name: "coin",
    aliases: ["coinflip"],
    async execute(client, message, args) {

        console.log("Command `coin` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        function randomCoin() {
            const random = ['Heads', 'Tails'];
            return random[Math.floor(Math.random() * random.length)];        
        }

        const Result = new discord.MessageEmbed()
            .setDescription(`**${randomCoin()}! :coin:**`)
            .setColor(colors.COLOR)

        message.channel.send({embeds: [Flipping]}).then(msg => {
            setTimeout(function () {
                msg.edit({embeds: [Result]});
            }, 2000);
        });
    }
}