const { SlashCommandBuilder, Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const Poll = require('@schemas/Poll');
const { getPollConfig } = require('@configs/pollConfig');
const { Embed } = require('@constants/embed');

module.exports = {
	name: 'choices-poll',
	/**
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction
     */
	async execute(client, interaction, color) {

		const config = await getPollConfig(client, interaction.guildId);
		if (!config) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use. Please run the command again.')
			]
		});

		if (!config.enabled) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('Polls are not enabled in this server.')
			]
		});

		const poll = await Poll.findOne({
			guildId: interaction.guildId,
			interaction: interaction.message.id
		}).clone().catch(e => { });

		if (!poll) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('Couldn\'t find the poll, this is an error. Please try again.')
			]
		});

		const options = [];
		interaction.components.map(item => options.push(`${item.components[0].value}`));

		if (options.length < 2 || options.length > 5) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('You need at least two options and a maximum of 5.')
			]
		});

		poll.options = options;
		await poll.save();

		const embed = new Embed(color)
			.setDescription(
				`Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.${options ? `\n\n**Entered Choices:**${options.map(o => `\n${o}`)}` : ''}`
			)
			.addFields(
				{ name: 'Channel', value: `<#${poll.channel}>`, inline: true },
				{ name: 'Duration', value: `${poll.duration}`, inline: true },
				{ name: 'Choices', value: `${poll.optionsCount}`, inline: true },
				{ name: 'Role', value: `${poll.role ? `${poll.role}` : 'None'}`, inline: true }
			);

		if (poll.topic !== 'none') embed.addFields({ name: 'Question', value: `${poll.topic}`, inline: true });
		if (poll.description !== 'none') embed.addFields({ name: 'Description', value: `${poll.description}`, inline: true });

		await interaction.update({ embeds: [embed] });
	}
};