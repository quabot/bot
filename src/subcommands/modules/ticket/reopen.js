const {
	ChatInputCommandInteraction,
	Client,
	ColorResolvable,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require('discord.js');
const { getTicketConfig } = require('@configs/ticketConfig');
const Ticket = require('@schemas/Ticket');
const { Embed } = require('@constants/embed');
const { getIdConfig } = require('@configs/idConfig');

module.exports = {
	parent: 'ticket',
	name: 'reopen',
	/**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {ColorResolvable} color
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: false });

		const config = await getTicketConfig(client, interaction.guildId);
		const ids = await getIdConfig(interaction.guildId);

		if (!config || !ids) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up some documents for first-time use! Please run the command again.')
			]
		});

		if (!config.enabled) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Tickets are disabled in this server.')
			]
		});

		const ticket = await Ticket.findOne({
			channelId: interaction.channelId
		});
		if (!ticket) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('This is not a valid ticket.')
			]
		});

		if (!ticket.closed) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('This ticket is not closed.')
			]
		});


		let valid = false;
		if (ticket.owner === interaction.user.id) valid = true;
		if (ticket.users.includes(interaction.user.id)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;
		if (!valid) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You are not allowed to reopen the ticket.')
			]
		});


		const openCategory = interaction.guild.channels.cache.get(config.openCategory);
		if (!openCategory) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('There is no category to move this ticket to once re-opened. Configure this on our [dashboard](https://quabot.net/dashboard).')
			]
		});

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Reopen this ticket with the button below this message.'),
			],
			components: [
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Primary)
							.setCustomId('reopen-ticket')
							.setLabel('🔓 Reopen')
					),
			]
		});
	}
};
