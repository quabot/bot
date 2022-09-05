const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-removefield",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true }).catch((err => { }));
        
        const index = interaction.message.embeds[1].data.fields ? interaction.message.embeds[1].data.fields.length - 1 : 0;

        interaction.message.edit({
            embeds: [
                EmbedBuilder.from(interaction.message.embeds[0]),
                EmbedBuilder.from(interaction.message.embeds[1]).spliceFields(index, 1),
            ]
        }).catch((err => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, `Field deleted.`)]
        }).catch((err => { }));
    }
}