const { SlashCommandBuilder, Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const Poll = require("../../../structures/schemas/Poll");
const { getPollConfig } = require("../../../utils/configs/pollConfig");
const { Embed } = require("../../../utils/constants/embed");

module.exports = {
    name: 'suggest',
    /**
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction
     */
    async execute(client, interaction, color) {

        const config = await getPollConfig(client, interaction.guildId);
        if (!config) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('We\'re still setting up some documents for first-time use. Please run the command again.')
            ]
        });

        if (!config.enabled) return await interaction.reply({
            embeds: [
                new Embed(color)
                    .setDescription('Polls are not enabled in this server.')
            ]
        });

        const poll = await Poll.findOne({
            guildId: interaction.guildId,
            interaction: interaction.message.id
        }).clone().catch(e => {});

        if (!poll) return await interaction.reply({
            embeds: [
                new Embed(color)
                .setDescription('Couldn\'t find the poll, this is an error. Please try again.')
            ]
        });
    }
}