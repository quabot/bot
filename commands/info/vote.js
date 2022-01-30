const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "vote",
    description: "QuaBot voting URL.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const YourPing = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setDescription(`Vote here: [top.gg](https://top.gg/bot/845603702210953246/vote)`);
            interaction.reply({ embeds: [YourPing] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
