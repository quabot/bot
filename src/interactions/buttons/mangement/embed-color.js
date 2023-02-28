const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");
const { isValidHttpUrl } = require("../../../utils/functions/string");

module.exports = {
    name: 'embed-color',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {

        const mainModal = new ModalBuilder()
            .setCustomId('embed-color-modal')
            .setTitle('Embed Color')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('color')
                        .setLabel('New color')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setMaxLength(500)
                        .setPlaceholder('#fffff')
                )
            );

        await interaction.showModal(mainModal);

        const modal = await interaction
            .awaitModalSubmit({
                time: 180000,
                filter: i => i.user.id === interaction.user.id,
            })
            .catch(e => {
                return null;
            });


        if (modal) {
            if (modal.customId !== 'embed-color-modal') return;

            await modal.deferReply({ ephemeral: true }).catch(e => { });
            const enteredColor = modal.fields.getTextInputValue('color');
            if (!enteredColor) return await modal.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription('No color entered, try again.')
                ],
            });

            if (!/^#([0-9A-F]{6}){1,2}$/i.test(enteredColor)) return await modal.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription('No valid color entered, try again.')
                ],
            });

            await interaction.message
                .edit({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0]),
                        EmbedBuilder.from(interaction.message.embeds[1]).setColor(enteredColor),
                    ],
                })

            await modal.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Set the color to: \n**${enteredColor}**`.slice(0, 2000))
                ],
            });
        }
    },
};