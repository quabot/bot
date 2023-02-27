const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");

module.exports = {
    name: 'embed-description',
    /**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {

        const mainModal = new ModalBuilder()
            .setCustomId('embed-description-modal')
            .setTitle('Embed Description')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('description')
                        .setLabel('New description')
                        .setStyle(TextInputStyle.Paragraph)
                        .setValue(interaction.message.embeds[1].data.description ?? '')
                        .setRequired(true)
                        .setMaxLength(4000)
                        .setPlaceholder('This is my embed description!')
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
            if (modal.customId !== 'embed-description-modal') return;

            await modal.deferReply({ ephemeral: true }).catch(e => { });
            const description = modal.fields.getTextInputValue('description');
            if (!description) return await modal.editReply({
                    embeds: [
                        new Embed(color)
                            .setDescription('No description entered, try again.')
                    ],
                });


            await interaction.message
                .edit({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0]),
                        EmbedBuilder.from(interaction.message.embeds[1]).setDescription(description),
                    ],
                })

            await modal.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Set the description to: \n**${description}**`.slice(0, 2000))
                ],
            });
        }
    },
};