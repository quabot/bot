const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "ping",
    aliases: ["lag"],
    async execute(client, message, args) {

        console.log("Command `ping` was used.");

        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        const getPing = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setDescription(":clock7:  Getting ping...");
        message.channel.send({ embeds: [getPing]}).then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;

            const urping = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setDescription(`:white_check_mark: Your current ping is: **${ping}ms**.`);

            m.edit({ embeds: [urping]})
        })

    }
}