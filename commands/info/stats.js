const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const config = require('../../files/config.json');

module.exports = {
    name: "stats",
    description: "View the discord bot stats and hardware.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        const embed = new Discord.MessageEmbed()
            .setTitle("Quabot Statistics")
            .setColor(colors.COLOR)
            .setThumbnail("https://i.imgur.com/jgdQUul.png")
            .addField("Memory", "1024MB", true)
            .addField("Library", "Discord.js V13", true)
            .addField("Node.js Version", "16.6.1", true)
            .addField("Version", config.VERSION, true)
            .addField("Commands", config.CMD_AMOUNT, true)
            .addField("Channels", `${client.channels.cache.size}`, true)
            .addField("Users", `${client.users.cache.size}`, true)
            .addField("Client", `${client.user.username}`, true)
            .addField("Servers", `${client.guilds.cache.size}`, true);
        interaction.reply({ embeds: [embed] });
    }

}