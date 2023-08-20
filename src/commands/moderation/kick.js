const { SlashCommandBuilder, Client, CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getModerationConfig } = require('../../utils/configs/moderationConfig');
const { getUser } = require('../../utils/configs/user');
const { Embed } = require('../../utils/constants/embed');
const Punishment = require('../../structures/schemas/Punishment');
const { randomUUID } = require('crypto');
const { CustomEmbed } = require('../../utils/constants/customEmbed');

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user.')
		.addUserOption(option => option
			.setName('user')
			.setDescription('The user you wish to kick.')
			.setRequired(true))
		.addStringOption(option => option
			.setName('reason')
			.setDescription('The reason for kicking the user.')
			.setRequired(false))
		.addBooleanOption(option => option
			.setName('private')
			.setDescription('Should the message be visible to you only?')
			.setRequired(false))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),
	/**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
	async execute(client, interaction, color) {

		//* Determine if the command should be ephemeral or not.
		const private = interaction.options.getBoolean('private') ?? false;

		//* Defer the reply to give the user an instant response.
		await interaction.deferReply({ ephemeral: private });


		//* Get the moderation config and return if it doesn't exist.
		const config = await getModerationConfig(client, interaction.guildId);
		if (!config) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We\'re still setting up moderation for first-time use! Please run the command again.')
			]
		});


		//* Get the reason and member and return if it doesn't exist.
		const reason = `${interaction.options.getString('reason') ?? 'No reason specified.'}`.slice(0, 800);
		const member = interaction.options.getMember('user');
		if (!member || !reason) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('Please fill out all the required fields.')
			]
		});
		await getUser(interaction.guildId, member.id);


		//* Prevent a non-allowed kick.
		if (member === interaction.member) return interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You cannot kick yourself.')
			]
		});

		if (member.roles.highest.rawPosition > interaction.member.roles.highest.rawPosition) return interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You cannot kick a user with roles higher than your own.')
			]
		});


		//* Get the user's database and return if it doesn't exist.
		const userDatabase = await getUser(interaction.guildId, member.id);
		if (!userDatabase) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('The user has been added to our database. Please run the command again.')
			]
		});


		//* Kick the user and return if it fails.
		let kick = true;
		await member.kick(reason).catch(async e => {
			kick = false;

			await interaction.editReply({
				embeds: [
					new Embed(color)
						.setDescription('Failed to kick the user.')
				]
			});
		});

		if (!kick) return;

		//* Update the database.
		userDatabase.kicks += 1;
		await userDatabase.save();


		const id = randomUUID();

		const NewPunishment = new Punishment({
			guildId: interaction.guildId,
			userId: member.id,

			channelId: interaction.channelId,
			moderatorId: interaction.user.id,
			time: new Date().getTime(),

			type: 'kick',
			id,
			reason,
			duration: 'none',
			active: false
		});
		await NewPunishment.save();


		//* Update the reply to confirm the kick.
		interaction.editReply({
			embeds: [
				new Embed(color)
					.setTitle('User Kicked')
					.setDescription(`**User:** ${member} (@${member.user.username})\n**Reason:** ${reason}`)
					.addFields(
						{
							name: 'Joined Server',
							value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
							inline: true,
						},
						{
							name: 'Account Created',
							value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
							inline: true,
						}
					)
					.setFooter({ text: `ID: ${id}` })
			]
		});

		//* Send the DM to the user.
		const sentFrom = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('sentFrom')
					.setLabel('Sent from server: ' + interaction.guild?.name ?? 'Unknown')
					.setStyle(ButtonStyle.Primary)
					.setDisabled(true)
			);


		if (config.kickDM) {
			const parseString = (text) =>
				text
					.replaceAll('{reason}', reason)
					.replaceAll('{user}', `${member}`)
					.replaceAll('{moderator}', interaction.user)
					.replaceAll('{staff}', interaction.user)
					.replaceAll('{server}', interaction.guild?.name ?? '')
					.replaceAll('{color}', color)
					.replaceAll('{id}', `${id}`)
					.replaceAll('{joined}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
					.replaceAll('{created}', `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`)
					.replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

			await member.send({
				embeds: [
					new CustomEmbed(config.kickDMMessage, parseString)
				],
				components: [sentFrom],
				content: parseString(config.kickDMMessage.content)
			}).catch(() => { });
		}


		//* Send the log to the log channel.
		if (config.channel) {
			const channel = interaction.guild.channels.cache.get(config.channelId);
			if (!channel) return;

			await channel.send({
				embeds: [
					new Embed(color)
						.setTitle('Member Kicked')
						.addFields(
							{ name: 'User', value: `${member} (@${member.user.username})`, inline: true },
							{ name: 'Kicked By', value: `${interaction.user}`, inline: true },
							{ name: 'Kicked In', value: `${interaction.channel}`, inline: true },
							{ name: 'User Total Kicks', value: `${userDatabase.kicks}`, inline: true },
							{
								name: 'Joined Server',
								value: `<t:${parseInt(member.joinedTimestamp / 1000)}:R>`,
								inline: true,
							},
							{
								name: 'Account Created',
								value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>`,
								inline: true,
							},
							{ name: 'Reason', value: `${reason}`, inline: false },
						)
				]
			});
		}
	}
};