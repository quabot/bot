const { Client, GuildMember } = require('discord.js');
const Level = require('../../structures/schemas/Level');

module.exports = {
	event: "guildMemberRemove",
	name: "levelDisable",
	/**
		 * @param {GuildMember} member
		 * @param {Client} client 
		 */
	async execute(member, client) {
		const user = await Level.findOne({ guildId: member.guild.id, userId: member.id });
		if (user) user.active = false;
	}
}