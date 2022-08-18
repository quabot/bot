const { Interaction, EmbedBuilder, Client } = require('discord.js');
const { getPost, getImage } = require('random-reddit');

module.exports = {
    name: "subreddit",
    command: "reddit",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply({ ephemeral: true });

        const post = await getPost(interaction.options.getString("reddit"));
        const image = await getImage(interaction.options.getString("reddit"));
        
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setDescription(`**${post.title}**`)
                    .setImage(image)
                    .setFooter({ text: `${post.subreddit_name_prefixed}`})
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}