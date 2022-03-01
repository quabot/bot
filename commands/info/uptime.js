const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');
const { dependencies } = require('../../embeds/info');

module.exports = {
    name: "uptime",
    description: "Bot's  uptime.",
    async execute(client, interaction) {
        try {
            const embed = new MessageEmbed()
                .setDescription(`QuaBot has been online since <t:${parseInt(client.readyTimestamp / 1000)}:R>. [Statistics](https://status.watchbot.app/bot/845603702210953246)`)
                .setAuthor("QuaBot", "https://i.imgur.com/jgdQUul.png")
                .setColor(COLOR_MAIN)
                .setTimestamp();
            interaction.reply({ embeds: [embed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: uptime`)] }).catch(err => console.log(err));;
            return;
        }
    }
}