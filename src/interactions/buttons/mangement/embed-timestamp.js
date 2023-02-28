const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");
const { isValidHttpUrl } = require("../../../utils/functions/string");

module.exports = {
    name: 'embed-timestamp',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });

        await interaction.message
            .edit({
                embeds: [
                    EmbedBuilder.from(interaction.message.embeds[0]),
                    EmbedBuilder.from(interaction.message.embeds[1]).setTimestamp(),
                ],
            })

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`Set the timestamp!`)
            ],
        });
    },
};