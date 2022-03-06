const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { VERSION, CMD_AMOUNT } = require('../../files/settings.json');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "stats",
    description: "Statistics on quabot.",
    async execute(client, interaction) {
        try {
            const embed = new MessageEmbed()
                .setTitle(`${client.user.tag}`)
                .setThumbnail("https://i.imgur.com/0vCe2oB.png")
                .addField("Memory", "1GB", true)
                .addField("Version", VERSION, true)
                .addField("Commands", CMD_AMOUNT, true)
                .addField("Channels", `${client.channels.cache.size}`, true)
                .addField("Users", `${client.users.cache.size}`, true)
                .addField("Servers", `${client.guilds.cache.size}`, true)
                .setColor(COLOR_MAIN)
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log(err));;
            return;
        }
    }
}