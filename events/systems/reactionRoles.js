const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "messageReactionAdd",
    async execute(messageReaction, user, client, color) {
        try {

            
            

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Event: " + this.name)] });
        }
    }
}