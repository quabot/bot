const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

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
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('tod-dare')
                            .setLabel(`Dare`)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('tod-random')
                            .setLabel(`Random`)
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        }).catch((err => { }));

    }
}