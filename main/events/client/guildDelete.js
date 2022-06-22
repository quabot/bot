const { MessageEmbed, MessageAttachment } = require('discord.js');

module.exports = {
    name: "guildDelete",
    async execute(guild, client, color) {
        try {

            client.guilds.cache.get("957024489638621185").channels.cache.get("979356759682613348").send({ embeds: [new MessageEmbed().setDescription(`QuaBot was removed from **${guild.name}**. It has lost **${guild.memberCount}** members.`).setFooter("Server: " + guild.name).setTimestamp()] });

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}