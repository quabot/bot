const { Client, ChatInputCommandInteraction } = require("discord.js");
const { getLevelConfig } = require("../../../utils/configs/levelConfig");
const Level = require("../../../structures/schemas/Level");

module.exports = {
	parent: 'level',
	name: 'reset',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply();
	

		if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You do not have the permissions required.')
			]
		});


		const config = await getLevelConfig(interaction.guildId, client);
		if (!config) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use, please try again.')
			]
		});
		if (!config.enabled) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Levels are disabled in this server.')
			]
		});


		await Level.findOneAndDelete({ guildId: interaction.guildId, userId: user.id });

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`Reset ${user}'s level to 0 and xp to 0. (Removed from database))`)
			]
		});
	}
};
