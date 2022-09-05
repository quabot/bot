const { Interaction, EmbedBuilder, Client, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { generateEmbed } = require('../../../structures/functions/embed');

module.exports = {
    name: "verification",
    command: "send",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true }).catch((err => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, "You can dismiss this message.")]
        }).catch((err => { }));

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle("Please verify to get access to the server!")
                    .setDescription("Click the button below this message to get verified.")
            ], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("verify-server")
                            .setLabel("Verify")
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        }).catch((err => { }));
    }
}