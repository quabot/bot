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

        await interaction.deferReply();

        const ch = interaction.options.getChannel("channel");
        console.log(ch)

        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`Channel Info`)
                    .addFields(
                        { name: "Channel", value: `${ch}`, inline: true },
                        { name: "Name", value: `${ch.name}`, inline: true },
                        { name: "Type", value: `${types[ch.type]}`, inline: true },
                        { name: "NSFW", value: `${ch.nsfw ? "Enabled" : "Disabled"}`, inline: true },
                        { name: "Ratelimit", value: `${ch.rateLimitPerUser ? ch.rateLimitPerUser + "s" : "0s"}`, inline: true },
                        { name: "Parent", value: `${ch.parentId ? "<#" + ch.parentId + ">" : "No parent category."}`, inline: true },
                        { name: "Description", value: `${ch.topic ? ch.topic : "No description set."}`, inline: false },
                    )
                    .setFooter({ text: `ID: ${ch.id}` })
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}