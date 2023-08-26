const { SlashCommandBuilder, Client, CommandInteraction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('applications')
		.setDescription('Fill out and view forms.')
		.addSubcommand(command => command
			.setName('apply')
			.setDescription('Apply for an application.')
			.addStringOption(option => option
				.setName('id')
				.setDescription('The application ID.')
				.setRequired(true)))
		.addSubcommand(command => command
			.setName('manage')
			.setDescription('Manage server forms.'))
		.addSubcommand(command => command
			.setName('list')
			.setDescription('See a list of forms in the server.'))
		.addSubcommand(command => command
			.setName('help')
			.setDescription('Get some information about the applications module.'))
		.setDMPermission(false),
	/**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {
	}
};