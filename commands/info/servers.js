const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "servers",
    description: "Amount of servers.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
                const YourPing = new discord.MessageEmbed()
                    .setColor(colors.COLOR)
                    .setDescription(`QuaBot is in \`${client.guilds.cache.size}\` servers.`);

                interaction.reply({ embeds: [YourPing] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
