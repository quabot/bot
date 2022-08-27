const { EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-removefield",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });
        
        const index = interaction.message.embeds[1].data.fields ? interaction.message.embeds[1].data.fields.length - 1 : 0;

        interaction.message.edit({
            embeds: [
                EmbedBuilder.from(interaction.message.embeds[0]),
                EmbedBuilder.from(interaction.message.embeds[1]).spliceFields(index, 1),
            ]
        }).catch((e => { }));

        interaction.editReply({
            embeds: [await generateEmbed(color, `Field deleted.`)]
        }).catch((e => { }));
    }
}