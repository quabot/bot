const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { Embed } = require('@constants/embed');
const { isValidHttpUrl } = require('../../../utils/functions/string');

module.exports = {
	name: 'embed-author',
	/**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {

		const mainModal = new ModalBuilder()
			.setCustomId('embed-author-modal')
			.setTitle('Embed Author')
			.addComponents(
				new ActionRowBuilder()
					.addComponents(
						new TextInputBuilder()
							.setCustomId('text')
							.setLabel('Author Name')
							.setStyle(TextInputStyle.Paragraph)
							.setValue(interaction.message.embeds[1].data.author?.name ?? '')
							.setRequired(true)
							.setMaxLength(256)
							.setPlaceholder('My author name...')
					),
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('icon')
						.setLabel('Author Icon')
						.setStyle(TextInputStyle.Paragraph)
						.setValue(interaction.message.embeds[1].data.author?.icon_url ?? '')
						.setRequired(false)
						.setMaxLength(250)
						.setPlaceholder('Insert your favorite author icon here...')
				),
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId('url')
						.setLabel('Author Url')
						.setStyle(TextInputStyle.Paragraph)
						.setValue(interaction.message.embeds[1].data.author?.url ?? '')
						.setRequired(false)
						.setMaxLength(250)
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
			if (modal.customId !== 'embed-author-modal') return;

			await modal.deferReply({ ephemeral: true }).catch(e => { });
			const text = modal.fields.getTextInputValue('text');
			let url = modal.fields.getTextInputValue('url') ?? null;
			let icon = modal.fields.getTextInputValue('icon') ?? null;
			if (!text) return await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Not all fields were filled out, try again.')
				],
			});

			if (!isValidHttpUrl(url)) url = null;
			if (!isValidHttpUrl(icon)) icon = null;


			if (interaction.message.embeds[1].data.description === '\u200b')
				delete interaction.message.embeds[1].data.description;

			await interaction.message
				.edit({
					embeds: [
						EmbedBuilder.from(interaction.message.embeds[0]),
						EmbedBuilder.from(interaction.message.embeds[1]).setAuthor({ name: text, iconURL: icon, url }),
					],
				});

			await modal.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Changed the author!')
				],
			});
		}
	},
};