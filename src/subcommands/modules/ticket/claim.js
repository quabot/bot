const { ChatInputCommandInteraction, Client, ColorResolvable, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const { getTicketConfig } = require('@configs/ticketConfig');
const Ticket = require('@schemas/Ticket');
const { Embed } = require('@constants/embed');
const { getIdConfig } = require('@configs/idConfig');

module.exports = {
	parent: 'ticket',
	name: 'claim',
	/**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });

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

		if (ticket.staff !== 'none') return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('The ticket is already claimed.')
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
					.setDescription('You are not allowed to claim this ticket.')
			]
		});

        
		ticket.staff = interaction.user.id;
		await ticket.save();


		const ticketMsg = (await interaction.channel.messages.fetch()).last();
		if (ticketMsg.author.id !== process.env.CLIENT_ID) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('There was an internal error. The original QuaBot message was deleted.')
			]
		});

		await ticketMsg.edit({
			embeds: [
				new Embed(color)
					.setTitle('New Ticket')
					.setDescription('Please wait, staff will be with you shortly.')
					.addFields(
						{ name: 'Topic', value:`${ticket.topic}`, inline: true },
						{ name: 'Topic', value:`<@${ticket.owner}>`, inline: true },
						{ name: 'Claimed By', value:`${interaction.user}`, inline: true }
					)
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId('close-ticket')
						.setLabel('🔒 Close')
						.setStyle(ButtonStyle.Secondary)
				),
			]
		});

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You have successfully claimed the ticket.')
			]
		});

		await interaction.channel.send({
			embeds: [
				new Embed(color)
					.setDescription(`This ticket has been claimed by ${interaction.user}.`)
			]
		});

		const logChannel = interaction.guild.channels.cache.get(config.logChannel);
		if (logChannel && config.logEnabled) await logChannel.send({
			embeds: [
				new Embed(color)
					.setTitle('Ticket Claimed')
					.addFields(
						{ name: 'Ticket Owner', value: `<@${ticket.owner}>`, inline: true },
						{ name: 'Channel', value: `${interaction.channel}`, inline: true },
						{ name: 'Claimed By', value: `${interaction.user}`, inline: true }
					)
					.setFooter({ text: `ID: ${ticket.id}` })
			]
		});
	}
};
