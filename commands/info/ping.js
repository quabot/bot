const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    description: 'Bot ping.',
    async execute(client, interaction, color) {
        try {

                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setDescription(`🏓 \`${client.ws.ping}ms\``)
                        .setColor(color)
                    ]
                }).catch(( err => { } ))

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("957024489638621185").channels.cache.get("957024594181644338").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}