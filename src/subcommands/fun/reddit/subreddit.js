const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');
const { getPost, getImage } = require('random-reddit');

module.exports = {
	parent: 'reddit',
	name: 'subreddit',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });

		const subreddit = interaction.options.getString('subreddit');
		const imageonly = interaction.options.getBoolean('imageonly' ?? false);

		if (!imageonly) {
			const post = await getPost(subreddit).catch(async e => {
				await interaction.editReply({
					embeds: [
						new Embed(color)
							.setDescription('Couldn\'t find that subreddit. This could be due to reddit reatelimits.')
					]
				});
				return;
			});
			if (!post) return;

			await interaction.editReply({
				embeds: [
					new Embed(color)
						.setTitle(`${post.title}`.slice(0, 256))
						.setURL(`https://reddit.com${post.permalink}`)
						.setDescription(post.is_gallery ? `This post is a gallery, check all the images here: ${post.url}`.slice(0, 1024) : (post.selftext ? `${post.selftext}`.slice(0, 1024) : null))
						.setImage(post.post_hint === 'image' ? `${post.url}` : null)
						.setFooter({ text: `Posted by u/${post.author_fullname} in r/${post.subreddit}` })
				],
			});
		} else {
			const post = await getImage(subreddit).catch(async e => {
				return await interaction.editReply({
					embeds: [
						new Embed(color)
							.setDescription('Couldn\'t find that subreddit. This could be due to reddit reatelimits.')
					]
				});
			});
			if (!post) return;

			await interaction.editReply({
				embeds: [
					new Embed(color)
						.setImage(`${post}`)
						.setFooter({ text: `Posted in r/${subreddit}` })
				],
			});
		}
	},
};
