const { Interaction, Client, PermissionFlagsBits } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'manage',
    command: 'applications',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction
            .reply({
                embeds: [
                    await generateEmbed(
                        color,
                        'You can create, edit and delete applications on my [dashboard](https://dashboard.quabot.net)!'
                    ),
                ],
            })
            .catch(e => {});
    },
};
