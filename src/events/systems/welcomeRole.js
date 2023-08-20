const { Client, Events, GuildMember } = require('discord.js');
const { getWelcomeConfig } = require('../../utils/configs/welcomeConfig');

module.exports = {
	event: Events.GuildMemberAdd,
	name: 'welcomeRole',
	/**
     * @param {GuildMember} member
     * @param {Client} client 
     */
	async execute(member, client) {

		const config = await getWelcomeConfig(client, member.guild.id);
		if (!config) return;
		if (!config.joinRoleEnabled) return;

		config.joinRole.forEach(role => {
			if (role.bot && member.user.bot) {
				const fRole = member.guild.roles.cache.get(role.role);
				if (!fRole) return;

				setTimeout(() => {
					member.roles.add(fRole).catch(e => { });
				}, role.delay);
			}

			if (role.bot === false && !member.user.bot) {
				const fRole = member.guild.roles.cache.get(role.role);
				if (!fRole) return;

				setTimeout(() => {
					member.roles.add(fRole).catch(e => { });
				}, role.delay);
			}
		});
	}
};