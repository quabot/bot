const axios = require('axios');
const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wyr')
        .setDescription('Get a random would you rather question.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(_client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const apiRes = await axios.get('https://would-you-rather-api.abaanshanid.repl.co/');

        await interaction.editReply({ embeds: [generateEmbed(color, apiRes.data.data)] }).catch(e => {});
    },
};
