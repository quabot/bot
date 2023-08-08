const Discord = require("discord.js");
const colors = require('../../files/colors.json')

module.exports = {
    name: "donate",
    aliases: [],
    cooldown: "3",
    async execute(client, message, args) {

        console.log("Command `donate` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;
        
        const embed = new Discord.MessageEmbed()
            .setTitle("Support Quabot")
            .setColor(colors.COLOR)
            .setDescription("Quabot is a currently a non-profit project, that takes up money and time. By donating to us via paypal you directly support us! :)")
            .addField("Donate", "[Click here](https://paypal.me/joascraft) for the link.")
            .addField("Donate Link 2", "You will recieve a role in our [Support Discord](https://discord.gg/kNfy8MRF4n), to donate: [Click here](https://donatebot.io/checkout/847828281860423690)")
        message.channel.send({embeds: [embed]})
    }

}