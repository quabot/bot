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
                }).catch(err => console.log(err));

        } catch (e) {
            console.log(e);
            client.guilds.cache.get("847828281860423690").channels.cache.get("938509157710061608").send({ embeds: [new MessageEmbed().setDescription(`${e}`).setFooter("Command: " + this.name)] });
        }
    }
}