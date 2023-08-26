const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('@constants/embed');

module.exports = {
	parent: 'channel',
	name: 'delete',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });

		const channel = interaction.options.getChannel('channel');

		await interaction.guild.channels.delete(channel).then(async () => {
			await interaction.editReply({
				embeds: [
					new Embed(color)
						.setDescription(`Deleted the channel #${channel.name}.`)
				]
			});
		}).catch(async (e) => {
			await interaction.editReply({
				embeds: [
					new Embed(color)
						.setDescription(`Failed to delete the channel. Error message: ${e.message}.`)
				]
			});
		});
	}
};
