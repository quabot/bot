const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: "truthordare",
    description: "Play a game of Truth Or Dare.",
    async execute(client, interaction, color) {

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`**Truth or Dare**`)
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('tod-truth')
                            .setLabel(`Truth`)
                            .setStyle('DANGER'),
                        new ButtonBuilder()
                            .setCustomId('tod-dare')
                            .setLabel(`Dare`)
                            .setStyle('SUCCESS'),
                        new ButtonBuilder()
                            .setCustomId('tod-random')
                            .setLabel(`Random`)
                            .setStyle('PRIMARY')
                    )
            ]
        }).catch((err => console.log(err)));

    }
}