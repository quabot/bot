const { ChatInputCommandInteraction, Client, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { getUserGame } = require('../../../utils/configs/userGame');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
	parent: 'profile',
	name: 'bio',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {

		const userSchema = await getUserGame(interaction.user.id);
		if (!userSchema) return await interaction.reply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		const modal = new ModalBuilder()
			.setTitle('Set your profile bio')
			.setCustomId('profile-bio')
			.addComponents(
				new ActionRowBuilder()
					.setComponents(
						new TextInputBuilder()
							.setCustomId('bio')
							.setMaxLength(350)
							.setMinLength(1)
							.setLabel('Bio')
							.setValue(userSchema.bio)
							.setPlaceholder('I am...')
							.setRequired(true)
							.setStyle(TextInputStyle.Paragraph)
					)
			);

		interaction.showModal(modal);
	},
};
