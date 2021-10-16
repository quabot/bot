const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');

module.exports = {
    name: "ping",
    aliases: ["lag"],
    async execute(client, message, args) {
        if (message.guild.me.permissions.has("MANAGE_MESSAGES")) message.delete({ timeout: 5000 });
        if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

        message.channel.send({ embeds: [PingGetting]}).then(m => {
            var ping = m.createdTimestamp - message.createdTimestamp;

            const YourPing = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setTitle(`:white_check_mark: Your current ping is: **${ping}ms**.`);

            m.edit({ embeds: [YourPing]})
        })

    }
}