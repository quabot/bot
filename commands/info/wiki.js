const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "wiki",
    description: "QuaBot official wiki page.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
                const YourPing = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`Go to our wiki [here](https://wiki.quabot.net/#/)`);

                interaction.reply({ embeds: [YourPing] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
