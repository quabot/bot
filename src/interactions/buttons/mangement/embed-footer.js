const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');
const { isValidHttpUrl } = require('../../../utils/functions/string');

module.exports = {
	name: 'embed-footer',
	/**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {

		const mainModal = new ModalBuilder()
			.setCustomId('embed-footer-modal')
			.setTitle('Embed Footer')
			.addComponents(
				new ActionRowBuilder()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('text')
							.setLabel('Footer Text')
							.setStyle(TextInputStyle.Paragraph)
							.setValue(interaction.message.embeds[1].data.footer?.text ?? '')
							.setRequired(true)
							.setMaxLength(2048)
							.setPlaceholder('My footer text...')
					),
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('icon')
						.setLabel('Footer Icon')
						.setStyle(TextInputStyle.Paragraph)
						.setValue(interaction.message.embeds[1].data.footer?.icon_url ?? '')
						.setRequired(false)
						.setMaxLength(500)
						.setPlaceholder('Insert your favorite footer image here...')
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
			if (modal.customId !== 'embed-footer-modal') return;

			await modal.deferReply({ ephemeral: true }).catch(e => { });
			const text = modal.fields.getTextInputValue('text');
			let url = modal.fields.getTextInputValue('icon') ?? null;
			if (!text) return await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Not all fields were filled out, try again.')
				],
			});

			if (!isValidHttpUrl(url)) url = null;


			if (interaction.message.embeds[1].data.description === '\u200b')
				delete interaction.message.embeds[1].data.description;

			await interaction.message
				.edit({
					embeds: [
						EmbedBuilder.from(interaction.message.embeds[0]),
						EmbedBuilder.from(interaction.message.embeds[1]).setFooter({ text: text, iconURL: url }),
					],
				});

			await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Changed the footer!')
				],
			});
		}
	},
};