const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { VERSION, CMD_AMOUNT } = require('../../files/settings.json');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "info",
    description: "QuaBot info.",
    async execute(client, interaction) {
        try {
            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
            let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;

            const guilds = client.guilds.cache.size;
            const users = client.users.cache.size;
            const channels = client.channels.cache.size;
            
            const embed = new MessageEmbed()
                .setTitle(`${client.user.tag}`)
                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                .addField("Version", `${VERSION}`)
                .addField("Servers", `${guilds.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                .addField("Users", `${users.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                .addField("Channels", `${channels.toLocaleString('us-US', { minimumFractionDigits: 0 })}`)
                .addField("Developers", "Joa_sss#0001\nThe Developer#0986")
                .addField("Commands", `${CMD_AMOUNT}`)
                .setFooter(`Uptime: ${uptime}`)
                .setColor(COLOR_MAIN)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: info`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}