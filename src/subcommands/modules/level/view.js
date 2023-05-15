const { Client, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction } = require("discord.js");
const { getSuggestConfig } = require("../../../utils/configs/suggestConfig");
const { Embed } = require("../../../utils/constants/embed");
const { getLevelConfig } = require("../../../utils/configs/levelConfig");
const { getLevel } = require("../../../utils/configs/level");

module.exports = {
	parent: 'level',
	name: 'view',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply();

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

		const user = interaction.options.getUser('user') ?? interaction.user;
		const levelDB = await getLevel(interaction.guildId, user.id);
		if (!levelDB) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use, please try again.')
			]
		});

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setThumbnail(user.displayAvatarURL({ dynamic: true }))
					.setTitle(`${user.tag}\'s level status`)
					.setDescription(`${user.tag} is level **${levelDB.level}** and has **${levelDB.xp}** xp.`)
			]
		});
	}
};
