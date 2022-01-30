const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { PingGetting } = require('../../files/embeds');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "status",
    description: "Bot Status.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {

            const YourPing = new discord.MessageEmbed()
                .setColor(colors.LIME)
                .setDescription(`**Client:** \`✅ ONLINE\` - \`${client.ws.ping}ms\`\n**Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Database:** \`✅ CONNECTED\``);

            interaction.reply({ embeds: [YourPing] })

        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}
