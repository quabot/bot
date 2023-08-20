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
	name: 'help',
	/**
	 * @param {Client} client
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {ColorResolvable} color
	 */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: false });

		const config = await getAfkConfig(interaction.guildId, client);
		const user = await getUser(interaction.guildId, interaction.user.id);
		if (!config || !user) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		if (!config.enabled) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('The afk module is disabled in this server.')
			]
		});

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setTitle('What is the AFK module and how do i use it?')
					.setDescription(`The AFK module is a way for you to set your 'status' to AFK. If you're AFK and you get mentioned by a user, they will be notified that you're AFK. You can set a custom message as to why you're AFK that users will see when they ping you. A full list of commands:
					\`/afk toggle\` - Enable/Disable your AFK status.
					\`/afk status\` - Set your AFK message.
					\`/afk list\` - See a list of AFK users in the server.
					\`/afk help\` - See help and commands about the AFK module.`)
			]
		});
	}
};
