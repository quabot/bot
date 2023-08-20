const { Client, ButtonInteraction, ColorResolvable, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
	name: 'embed-send',
	/**
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });

		const msg = interaction.message.embeds[0].data.description;
		const channel = interaction.guild.channels.cache.get(`${msg.slice(msg.indexOf('<') + 2, msg.length - 58)}`);

		const embed = EmbedBuilder.from(interaction.message.embeds[1]);
		if (embed.data.description === '\u200b') await channel.send({ content: interaction.message.content });
		if (embed.data.description !== '\u200b') await channel.send({ content: interaction.message.content, embeds: [embed] });

		const buttons1 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setDisabled(true).setCustomId('embed-message').setLabel('Set Message').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-title').setLabel('Set Title').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-url').setLabel('Set Url').setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setDisabled(true)
				.setCustomId('embed-description')
				.setLabel('Set Description')
				.setStyle(ButtonStyle.Primary)
		);

		const buttons2 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setDisabled(true).setCustomId('embed-thumbnail').setLabel('Set Thumbnail').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-image').setLabel('Set Image').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-footer').setLabel('Set Footer').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-timestamp').setLabel('Add Timestamp').setStyle(ButtonStyle.Primary)
		);

		const buttons3 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setDisabled(true).setCustomId('embed-color').setLabel('Set Color').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-author').setLabel('Set Author').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-addfield').setLabel('Add Field').setStyle(ButtonStyle.Primary),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-removefield').setLabel('Remove Field').setStyle(ButtonStyle.Danger)
		);

		const buttons4 = new ActionRowBuilder().addComponents(
			new ButtonBuilder().setDisabled(true).setCustomId('embed-send').setLabel('Send Message').setStyle(ButtonStyle.Success),
			new ButtonBuilder().setDisabled(true).setCustomId('embed-cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger)
		);

		await interaction.message.edit({ components: [buttons1, buttons2, buttons3, buttons4] });

		interaction
			.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Message has been sent!')
				],
			});
	},
};