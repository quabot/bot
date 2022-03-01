const { MessageEmbed } = require('discord.js');

const { COLOR_MAIN } = require('../../files/colors.json');
const { error } = require('../../embeds/general');

module.exports = {
    name: "vote",
    description: "QuaBot voting URL.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const vote = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setDescription(`Vote here: [top.gg](https://top.gg/bot/845603702210953246/vote)`);
            interaction.reply({ embeds: [vote] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: servers`)] }).catch(err => console.log(err));;
            return;
        }
    }
}
