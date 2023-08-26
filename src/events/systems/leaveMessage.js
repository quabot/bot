const { Client, Events, GuildMember } = require('discord.js');
const { getServerConfig } = require('@configs/serverConfig');
const { getWelcomeConfig } = require('@configs/welcomeConfig');
const { CustomEmbed } = require('@constants/customEmbed');

module.exports = {
	event: Events.GuildMemberRemove,
	name: 'leaveMessage',
	/**
     * @param {GuildMember} member
     * @param {Client} client 
     */
	async execute(member, client) {

		const config = await getWelcomeConfig(client, member.guild.id);
		const custom = await getServerConfig(client, member.guild.id);
		if (!config) return;
		if (!config.leaveEnabled) return;

		const channel = member.guild.channels.cache.get(config.leaveChannel);
		if (!channel) return;

		const parseString = (text) =>
			text
				.replaceAll('{user}', `${member}`)
				.replaceAll('{username}', member.user.username ?? '')
				.replaceAll('{tag}', member.user.tag ?? '')
				.replaceAll('{discriminator}', member.user.discriminator ?? '')
				.replaceAll('{avatar}', member.displayAvatarURL() ?? '')
				.replaceAll('{icon}', member.guild.iconURL() ?? '')
				.replaceAll('{server}', member.guild.name ?? '')
				.replaceAll('{id}', `${member.user.id}`)
				.replaceAll('{members}', member.guild.memberCount ?? '')
				.replaceAll('{color}', `${custom.color ?? '#416683'}`);

		if (config.leaveType === 'embed') {
			const embed = new CustomEmbed(config.leaveMessage, parseString);
			await channel.send({ embeds: [embed], content: parseString(config.leaveMessage.content) });
		} else {
			if (config.leaveMessage.content === '') return;
			await channel.send({ content: parseString(config.leaveMessage.content) });
		}
	}
};