const { Interaction, EmbedBuilder, Client } = require('discord.js');
const { getImage, getPost } = require('random-reddit');

module.exports = {
    name: 'meme',
    command: 'reddit',
    /**
     * @param {Client} client
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        const post = await getPost('memes');
        const image = await getImage('memes');

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setDescription(`**${post.title}**`)
                        .setImage(image)
                        .setFooter({ text: `${post.subreddit_name_prefixed}` })
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
