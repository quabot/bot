const { Interaction, EmbedBuilder, Client } = require('discord.js');
const { getPost, getImage } = require('random-reddit');

module.exports = {
    name: "cat",
    command: "reddit",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply().catch(() => null);

        const post = await getPost("cats");
        const image = await getImage("cats");
        
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`**${post.title}**`)
                    .setImage(image)
                    .setFooter({ text: `${post.subreddit_name_prefixed}`})
                    .setTimestamp()
            ]
        }).catch(() => null);
    }
}