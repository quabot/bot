const { EmbedBuilder } = require("discord.js");
const { generateEmbed } = require("../../../structures/functions/embed");

module.exports = {
    id: "embed-send",
    /**
     * @param {import("discord.js").Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const msg = interaction.message.embeds[0].data.description;
        const channel = interaction.guild.channels.cache.get(`${msg.slice(msg.indexOf('<') + 2, msg.length - 2)}`);

        const embed = EmbedBuilder.from(interaction.message.embeds[1]);
        channel.send({ embeds: [embed] }).catch((e => console.log(e)));

        interaction.editReply({
            embeds: [await generateEmbed(color, "Sent the embed to the channel!")]
        }).catch((e => { }));
    }
}