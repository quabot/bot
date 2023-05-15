const { Client, ChatInputCommandInteraction } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");
const { getLevelConfig } = require("../../../utils/configs/levelConfig");

module.exports = {
	parent: 'level',
	name: 'leaderboard',
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

		const Level = require('../../../structures/schemas/Level');
		const leaderboard = await Level.find({
			guildId: interaction.guildId
		}).sort({ level: -1, xp: -1 }).limit(10);

		let lb = '';
		leaderboard.forEach(i => lb = lb + `**${leaderboard.indexOf(i)+1}.** <@${i.userId}> - Level: ${i.level}, XP: ${i.xp}\n`);

		await interaction.editReply({
			embeds: [
				new Embed(color)
				.setTitle(`${interaction.guild.name}'s level leaderboard`)
				.setDescription(`To view the full leaderboard, visit our [dashboard](https://quabot.net/dashboard/${interaction.guildId}/levels/leaderboard)\n\n${lb}`)
			]
		})
	}
};
