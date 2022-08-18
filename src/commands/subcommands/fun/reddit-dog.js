const { Interaction, EmbedBuilder, Client } = require('discord.js');
const { getPost, getImage } = require('random-reddit');

module.exports = {
    name: "dog",
    command: "reddit",
    /**
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    async execute(client, interaction, color) {

        await interaction.deferReply();

        const post = await getPost("dogpictures");
        const image = await getImage("dogpictures");
        
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setTitle(`${post.title}`)
                    .setImage(image)
                    .setFooter({ text: `${post.subreddit_name_prefixed}`})
                    .setTimestamp()
            ]
        }).catch((e => { }));
    }
}