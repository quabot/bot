const { SlashCommandBuilder, Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const Poll = require('@schemas/Poll');
const { getPollConfig } = require('@configs/pollConfig');
const { Embed } = require('@constants/embed');

module.exports = {
	name: 'info-poll',
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

		const question = interaction.fields.getTextInputValue('question');
		const description = interaction.fields.getTextInputValue('description');

		if (!question || !description) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('Missing some required field values.')
			]
		});

		poll.topic = question;
		poll.description = description;
		await poll.save();

		const embed = new Embed(color)
			.setDescription(
				`Click the blue button below this message to enter the details for the poll. When entered, click the gray button to enter the choices.${poll.options.length !== 0 ? `\n\n**Entered Choices:**${poll.options.map(o => `\n${o}`)}` : ''}`
			)
			.addFields(
				{ name: 'Channel', value: `<#${poll.channel}>`, inline: true },
				{ name: 'Duration', value: `${poll.duration}`, inline: true },
				{ name: 'Choices', value: `${poll.optionsCount}`, inline: true },
				{ name: 'Role', value: `${poll.role ? `${poll.role}` : 'None'}`, inline: true },
				{ name: 'Question', value: `${question}`, inline: true },
				{ name: 'Description', value: `${description}`, inline: true }
			);
		await interaction.update({ embeds: [embed] });
	}
};