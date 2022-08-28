const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "server",
    command: "avatar",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch((e => { }));

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setImage(`${interaction.guild.iconURL({ size: 1024, forceStatic: false })}`)
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}