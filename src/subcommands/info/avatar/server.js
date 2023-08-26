const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');

module.exports = {
	parent: 'avatar',
	name: 'server',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply();

		const guild = interaction.guild;

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setImage(
						guild.iconURL({ size: 1024, forceStatic: false }) ??
                        'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png'
					)
					.setTitle(`${guild.name}'s avatar`),
			],
		});
	},
};
