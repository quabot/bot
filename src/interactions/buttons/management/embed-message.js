const { PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputStyle, TextInputBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    id: 'embed-message',
    /**
     * @param {import("discord.js").Interaction} interaction
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {
        const messageModal = new ModalBuilder()
            .setCustomId('embed-message-modal')
            .setTitle('Message Above Embed')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('message')
                        .setLabel('New message')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(true)
                        .setMaxLength(1950)
                        .setPlaceholder('This is my message!')
                )
            );

        await interaction.showModal(messageModal).catch(e => {});

        const modal = await interaction
            .awaitModalSubmit({
                time: 180000,
                filter: i => i.user.id === interaction.user.id,
            })
            .catch(e => {
                return null;
            });

        if (modal) {
            if (modal.customId !== 'embed-message-modal') return;

            await modal.deferReply({ ephemeral: true }).catch(e => {});
            const message = modal.fields.getTextInputValue('message');
            if (!message)
                modal
                    .editReply({
                        embeds: [await generateEmbed(color, 'No message entered, try again.')],
                    })
                    .catch(e => {});

            interaction.message
                .edit({
                    content: message,
                })
                .catch(e => {});

            modal
                .editReply({
                    embeds: [await generateEmbed(color, `Set the message to: \n**${message}**`)],
                })
                .catch(e => {});
        }
    },
};
