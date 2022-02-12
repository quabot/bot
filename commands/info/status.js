const { MessageEmbed } = require('discord.js');
const { error } = require('../../embeds/general');

module.exports = {
    name: "status",
    description: "Bot Status.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const status = new MessageEmbed()
                .setColor(`GREEN`)
                .setDescription(`**Client:** \`✅ ONLINE\` - \`${client.ws.ping}ms\`\n**Uptime:** <t:${parseInt(client.readyTimestamp / 1000)}:R>\n\n**Database:** \`✅ CONNECTED\``);
            interaction.reply({ embeds: [status] }).catch(err => console.log("Error!"));

        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}
