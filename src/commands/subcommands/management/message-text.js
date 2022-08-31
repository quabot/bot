const { Interaction, Client, PermissionFlagsBits, ActionRowBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "text",
    command: "message",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        const channel = interaction.options.getChannel("channel");

        const modalText = new ModalBuilder()
            .setCustomId('text-modal')
            .setTitle("Text")
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('text')
                            .setLabel("Message to Send")
                            .setStyle(TextInputStyle.Paragraph)
                            .setRequired(true)
                            .setMaxLength(2000),
                    ),
            )

        await interaction.showModal(modalText);

        const modal = await interaction.awaitModalSubmit({
            time: 60000,
            filter: i => i.user.id === interaction.user.id,
        }).catch(e => {
            return null
        });

        if (modal) {
            if (modal.customId !== 'text-modal') return;

            await modal.deferReply({ ephemeral: true }).catch((e => { }));
            const text = modal.fields.getTextInputValue("text");
            
            if (!text) modal.editReply({ embeds: [await generateEmbed(color, "No text entered, try again.")], ephemeral: true }).catch((e => { }));

            modal.editReply({
                embeds: [await generateEmbed(color, `Sent the message!`)]
            }).catch((e => { }));

            channel.send({
                content: text
            }).catch((e => { }))
        }
    }
}