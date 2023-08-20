const {
	ChatInputCommandInteraction,
	Client,
	ColorResolvable,
	PermissionFlagsBits,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require('discord.js');
const { getTicketConfig } = require('../../../utils/configs/ticketConfig');
const Ticket = require('../../../structures/schemas/Ticket');
const { Embed } = require('../../../utils/constants/embed');
const { getIdConfig } = require('../../../utils/configs/idConfig');

module.exports = {
	parent: 'ticket',
	name: 'delete',
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


		let allowed = false;
		if (ticket.owner === interaction.user.id) allowed = true;
		if (ticket.users.includes(interaction.user.id)) allowed = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) allowed = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) allowed = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) allowed = true;
		config.staffRoles.forEach(r => {
			if (interaction.member.roles.cache.some(role => role.id === r)) allowed = true;
		});
		if (!allowed) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You are not allowed to delete the ticket, you need to be added, be the owner, and/or a staff member to delete it.')
			]
		});

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Delete this ticket with the button below this message.'),
			],
			components: [
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setStyle(ButtonStyle.Secondary)
							.setCustomId('delete-ticket')
							.setLabel('🗑️ Delete')
					),
			]
		});
	}
};
