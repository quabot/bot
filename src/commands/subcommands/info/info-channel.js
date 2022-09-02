const { Interaction, EmbedBuilder, Client } = require('discord.js');
const types = ["Text", "DM", "Voice", "DM", "Category", "News", "News Thread", "Thread", "Private Thread", "Stage", "Directory", "Forum"];

module.exports = {
    name: "channel",
    command: "info",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch(() => null);

        const ch = interaction.options.getChannel("channel");

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Channel Info`)
                    .addFields(
                        { name: "**General:**", value: `
                        **• Name:** ${ch.name}
                        **• Channel:** ${ch}
                        **• ID:** ${ch.id}
                        **• Type:** ${types[ch.type]}
                        **• NSFW:** ${ch.nsfw ? "Enabled" : "Disabled"}
                        **• Ratelimit:** ${ch.nsfw ? "Enabled" : "Disabled"}
                        **• Parent:** ${ch.parentId ? "<#" + ch.parentId + ">" : "No parent category."}
                        `, inline: false },
                        { name: "**Description:**", value: `${ch.topic ||"Not set"}`, inline: false },
                    )
                    .setTimestamp()
            ]
        }).catch(() => null);
    }
}