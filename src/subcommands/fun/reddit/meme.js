const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');
const { getPost } = require('random-reddit');

module.exports = {
    parent: 'reddit',
    name: 'meme',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const post = await getPost('meme');
        
        await interaction.editReply({
            embeds: [
                new Embed(color)
                .setTitle(`${post.title}`)
                .setURL(`${post.url}`)
                .setDescription(post.is_gallery ? `This post is a gallery, check all the images here: ${post.url}` : null)
                .setImage(`${post.url}`)
                .setFooter({ text: `Posted by u/${post.author_fullname} in r/${post.subreddit}` })
            ],
        });
    },
};
