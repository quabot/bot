const { Client, ChatInputCommandInteraction } = require("discord.js");
const { Embed } = require("../../../utils/constants/embed");

module.exports = {
	parent: 'level',
	name: 'help',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply();
		
		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setTitle('What is the levels module and how do i use it?')
					.setDescription(`Levels are a way to get XP and levels for being active in a server. If the server admins configured it, you can also get different roles at different levels. By chatting, you will recieve a random number of XP, with a limit per minute. It is also influenced by the length of your message. When you get the required amount of XP, you will will level up (and be notified, if enabled). You can view the leaderboard on our dashboard. The full list of level commands:
					\`/level view\` - View yours or someone else's amount of XP and levels.
					\`/level leaderboard\` - View the server level leaderboard.
					\`/level help\` - View information about the levels module.`)
			]
		});
	}
};
