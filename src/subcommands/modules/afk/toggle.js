const {
	ChatInputCommandInteraction,
	Client,
	ColorResolvable
} = require('discord.js');
const { getAfkConfig } = require('@configs/afkConfig');
const { getUser } = require('@configs/user');
const { Embed } = require('@constants/embed');

module.exports = {
	parent: 'afk',
	name: 'toggle',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });
			
		let enabled = interaction.options.getBoolean('enabled');

		const config = await getAfkConfig(interaction.guildId, client);
		const user = await getUser(interaction.guildId, interaction.user.id);
		if (!config || !user) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});
		if (enabled === null) enabled = !user.afk;

		if (!config.enabled) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('The afk module is disabled in this server.')
			]
		});

		user.afk = enabled;
		await user.save();

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`${enabled ? 'Enabled' : 'Disabled'} your afk status.`)
			]
		});
	}
};
