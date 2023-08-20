const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');
const { isValidHttpUrl } = require('../../../utils/functions/string');

module.exports = {
	name: 'embed-url',
	/**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {

		const mainModal = new ModalBuilder()
			.setCustomId('embed-url-modal')
			.setTitle('Embed Url')
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('url')
						.setLabel('New url')
						.setStyle(TextInputStyle.Paragraph)
						.setValue(interaction.message.embeds[1].data.url ?? '')
						.setRequired(true)
						.setMaxLength(500)
						.setPlaceholder('https://quabot.net')
				)
			);

		await interaction.showModal(mainModal);

		const modal = await interaction
			.awaitModalSubmit({
				time: 180000,
				filter: i => i.user.id === interaction.user.id,
			})
			.catch(e => {
				return null;
			});


		if (modal) {
			if (modal.customId !== 'embed-url-modal') return;

			await modal.deferReply({ ephemeral: true }).catch(e => { });
			const url = modal.fields.getTextInputValue('url');
			if (!url) return await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('No url entered, try again.')
				],
			});

			if (!isValidHttpUrl(url)) return await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('No valid url entered, try again.')
				],
			});


			if (interaction.message.embeds[1].data.description === '\u200b')
				delete interaction.message.embeds[1].data.description;

			await interaction.message
				.edit({
					embeds: [
						EmbedBuilder.from(interaction.message.embeds[0]),
						EmbedBuilder.from(interaction.message.embeds[1]).setURL(url),
					],
				});

			await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription(`Set the url to: \n**${url}**`.slice(0, 2000))
				],
			});
		}
	},
};