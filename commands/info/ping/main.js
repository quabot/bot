const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "ping",
    description: 'Bot ping.',
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`🏓 \`${client.ws.ping}ms\``)
                    .setColor(color)
            ]
        }).catch((err => { }))

    }
}