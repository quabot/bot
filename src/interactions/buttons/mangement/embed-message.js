const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");

module.exports = {
    name: 'embed-message',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
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
                        .setValue(interaction.message.content ?? '')
                        .setRequired(true)
                        .setMaxLength(1950)
                        .setPlaceholder('This is my message!')
                )
            );

        await interaction.showModal(messageModal);

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

            await modal.deferReply({ ephemeral: true }).catch(e => { });
            const message = modal.fields.getTextInputValue('message');
            if (!message) return await modal.editReply({
                    embeds: [
                        new Embed(color)
                            .setDescription('No message entered, try again.')
                    ],
                });

            await interaction.message.edit({
                content: message,
            });

            await modal.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Set the message to: \n**${message}**`.slice(0,2000))
                ],
            });
        }
    },
};