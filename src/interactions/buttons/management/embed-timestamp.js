const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    id: "embed-timestamp",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    permission: PermissionFlagsBits.Administrator,
    async execute(_client, interaction, _color) {
        try {
            await interaction.deferReply({ ephemeral: true });

            interaction.message.edit({
                embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0]),
                        EmbedBuilder.from(interaction.message.embeds[1]).setTimestamp(),
                    ]
            });

            await interaction.editReply({ content: "Added a timestamp!" });
        } catch (e) {
          console.log(e);
        }
    }
}