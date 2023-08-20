const { SlashCommandBuilder, Client, ModalSubmitInteraction, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');
const Suggestion = require('../../../structures/schemas/Suggestion');
const { getIdConfig } = require('../../../utils/configs/idConfig');
const { getSuggestConfig } = require('../../../utils/configs/suggestConfig');
const { CustomEmbed } = require('../../../utils/constants/customEmbed');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
	name: 'suggest',
	/**
     * @param {Client} client 
     * @param {ModalSubmitInteraction} interaction
     */
	async execute(client, interaction, color) {
		await interaction.deferReply({ ephemeral: true });

		const config = await getSuggestConfig(client, interaction.guildId ?? '');
		if (!config) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We are setting up suggestions for first-time use, please run the command again.')
			]
		});

		if (!config.enabled)
			return await interaction.editReply({
				embeds: [new Embed(color).setDescription('Suggestions are disabled in this server.')],
			});


		const channel = interaction.guild?.channels.cache.get(config.channelId);
		if (!channel)
			return await interaction.editReply({
				embeds: [
					new Embed(color).setDescription(
						'The suggestions channel has not been configured. This can be done our [dashboard](https://quabot.net).'
					),
				],
			});

		const suggestion = interaction.fields.getTextInputValue('suggestion');
		if (!suggestion) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('You didn\'t give a suggestion.')
			]
		});

		const ids = await getIdConfig(interaction.guildId);
		if (!ids) return await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription('We are setting up some final documents, please run the command again.')
			]
		});

		const getParsedString = (text) => text
			.replaceAll('{suggestion}', suggestion)
			.replaceAll('{user}', `${interaction.user}`)
			.replaceAll('{avatar}', interaction.user.displayAvatarURL() ?? '')
			.replaceAll('{username}', `${interaction.user.username}`)
			.replaceAll('{tag}', `${interaction.user.tag}`)
			.replaceAll('{discriminator}', `${interaction.user.discriminator}`)
			.replaceAll('{servername}', `${interaction.guild.name}`)
			.replaceAll('{id}', ids.suggestId + 1 ?? 0)
			.replaceAll('{server}', interaction.guild?.name ?? '')
			.replaceAll('{guild}', interaction.guild?.name ?? '')
			.replaceAll('{servername}', interaction.guild?.name ?? '')
			.replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

		const suggestEmbed = new CustomEmbed(config.message, getParsedString);

		const msg = await channel.send({ embeds: [suggestEmbed], content: getParsedString(config.message.content) });
		await msg.react(config.emojiGreen);
		await msg.react(config.emojiRed);

		ids.suggestId += 1;
		await ids.save();


		const newSuggestion = new Suggestion({
			guildId: interaction.guildId,
			id: ids.suggestId ?? 0,
			msgId: msg.id,
			suggestion: suggestion,
			status: 'pending',
			userId: interaction.user.id,
		});
		await newSuggestion.save();

		await interaction.editReply({
			embeds: [
				new Embed(color)
					.setDescription(`Successfully created your suggestion! You can check it out [here](${msg.url}). ${config.dm && 'You will receive a DM when staff has approved/denied your suggestion.'}`)
					.setFooter({ text: `ID: ${ids.suggestId}` })
			]
		});


		if (!config.logEnabled) return;
		const logChannel = interaction.guild?.channels.cache.get(config.logChannelId);
		if (!logChannel) return;

		await logChannel.send({
			embeds: [
				new Embed(config.colors.pending)
					.setTitle('New Suggestion')
					.addFields(
						{ name: 'User', value: `${interaction.user}`, inline: true },
						{ name: 'State', value: 'Pending', inline: true },
						{ name: 'ID', value: `${ids.suggestId}`, inline: true },
						{ name: 'Message', value: `[Click to jump](${msg.url})`, inline: true },
						{ name: 'Suggestion', value: `${suggestion}`, inline: false },
					)
			], components: [
				new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setCustomId('suggestion-approve')
							.setLabel('Approve')
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId('suggestion-deny')
							.setLabel('Deny')
							.setStyle(ButtonStyle.Danger),
						new ButtonBuilder()
							.setCustomId('suggestion-delete')
							.setLabel('Delete')
							.setStyle(ButtonStyle.Secondary)
					)
			]
		});
	}
};