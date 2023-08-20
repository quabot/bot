const { SlashCommandBuilder, Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const Suggestion = require('../../../structures/schemas/Suggestion');
const { getIdConfig } = require('../../../utils/configs/idConfig');
const { getSuggestConfig } = require('../../../utils/configs/suggestConfig');
const { CustomEmbed } = require('../../../utils/constants/customEmbed');
const { Embed } = require('../../../utils/constants/embed');
const { getUserGame } = require('../../../utils/configs/userGame');

module.exports = {
	name: 'profile-bio',
	/**
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });
        
		const userSchema = await getUserGame(interaction.user.id);
		if (!userSchema) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		const bio = interaction.fields.getTextInputValue('bio');

		userSchema.bio = bio ?? '-';
		await userSchema.save();

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Updated your bio!')
			]
		});
	}
};