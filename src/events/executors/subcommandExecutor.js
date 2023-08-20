const { Client, Interaction, Colors, EmbedBuilder } = require('discord.js');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { handleError } = require('../../utils/constants/errorHandler');

module.exports = {
	event: 'interactionCreate',
	name: 'subcommandExecutor',
	/**
     * @param {Interaction} interaction
     * @param {Client} client 
     */
	async execute(interaction, client) {
		try {

			if (!interaction.isChatInputCommand() || !interaction.guildId) return;

			const subcommandName = interaction.options.getSubcommand();
			if (!subcommandName) return;

			const subcommand = client.subcommands.get(`${subcommandName}/${interaction.commandName}`);
			if (!subcommand)
				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(Colors.Red)
							.setDescription(
								`⚠️ An error occurred! Couldn't find the command ${interaction.commandName} with subcommand ${subcommandName}!`
							)
							.setTimestamp(),
					],
				});

			const config = await getServerConfig(client, interaction.guildId);
			if (config && config.disabledCommands && config.disabledCommands.includes(interaction.commandName)) return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setColor(config.color ?? '#416683')
						.setDescription('That command is not enabled in this server.')
				], ephemeral: true
			});

			const color = config?.color ?? '#416683';

			subcommand
				.execute(client, interaction, color)
				.catch((e) => handleError(client, e, `${interaction.options.getSubcommand()}/${interaction.commandName}`));

		} catch (e) { return; }
	}
};