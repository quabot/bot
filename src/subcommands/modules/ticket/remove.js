const {
	ChatInputCommandInteraction,
	Client,
	ColorResolvable,
	PermissionFlagsBits
} = require('discord.js');
const { getTicketConfig } = require('@configs/ticketConfig');
const Ticket = require('@schemas/Ticket');
const { Embed } = require('@constants/embed');
const { getIdConfig } = require('@configs/idConfig');

module.exports = {
	parent: 'ticket',
	name: 'remove',
	/**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     * @param {ColorResolvable} color
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: false });
		const user = interaction.options.getUser('user');

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

		if (!user) return;

		let valid = false;
		if (ticket.owner === interaction.user.id) valid = true;
		if (ticket.users.includes(interaction.user.id)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) valid = true;
		if (interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) valid = true;
		if (!valid) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You are not allowed to add users to the ticket.')
			]
		});


		const array = ticket.users;
		if (!array.includes(user.id))
			return interaction
				.editReply({
					embeds: [new Embed(color).setDescription('That user isn\'t in this ticket!')],
				})
				.catch(e => {});

		for (var i = 0; i < array.length; i++) {
			if (array[i] === `${user.id}`) {
				array.splice(i, 1);
				i--;
			}
		}

		await ticket.updateOne({
			users: array,
		});

		await interaction.channel.permissionOverwrites.edit(user, { ViewChannel: false, SendMessages: false });

		await interaction
			.editReply({
				embeds: [
					new Embed(color)
						.setDescription(`Removed ${user} from the ticket.`)
				],
			});
	}
};
