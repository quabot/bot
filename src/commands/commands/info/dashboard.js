const { Interaction, SlashCommandBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Get a link to the QuaBot dashboard.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        interaction
            .editReply({
                embeds: [
                    await generateEmbed(
                        color,
                        'Configure QuaBot on our dashboard **[here](https://dashboard.quabot.net)**.'
                    ),
                ],
            })
            .catch(e => {});
    },
};
