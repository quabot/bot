const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Join the QuaBot support server.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "For questions, suggestions and more, join our support server at **[discord.gg/HYGA7Y6ptk](https://discord.gg/HYGA7Y6ptk)**.")]
        }).catch((e => { }));
    }
}