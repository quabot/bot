const {
    Interaction,
    EmbedBuilder,
    Client,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: 'tickets',
    command: 'send',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true }).catch(e => {});

        interaction
            .editReply({
                embeds: [await generateEmbed(color, 'You can dismiss this message.')],
            })
            .catch(e => {});

        interaction.channel
            .send({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle('Create ticket')
                        .setDescription('Click on the button below this message to create a ticket.'),
                ],
                components: [
                    new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('create-ticket')
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel('🎫 Ticket')
                    ),
                ],
            })
            .catch(e => {});
    },
};
