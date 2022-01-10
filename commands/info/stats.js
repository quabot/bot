const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/settings.json');

const { errorMain } = require('../../files/embeds');
module.exports = {
    name: "stats",
    description: "Bot statistics.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const embed = new Discord.MessageEmbed()
                .setTitle("Quabot Statistics")
                .setColor(colors.COLOR)
                .setThumbnail("https://i.imgur.com/jgdQUul.png")
                .addField("Memory", "8GB", true)
                .addField("Version", config.VERSION, true)
                .addField("Commands", config.CMD_AMOUNT, true)
                .addField("Channels", `${client.channels.cache.size}`, true)
                .addField("Users", `${client.users.cache.size}`, true)
                .addField("Servers", `${client.guilds.cache.size}`, true);
            interaction.reply({ embeds: [embed] });
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}