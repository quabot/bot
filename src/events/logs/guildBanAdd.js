const { Client, Events, GuildBan, Colors } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
	event: Events.GuildBanAdd,
	name: 'guildBanAdd',
	/**
     * @param {GuildBan} ban
     * @param {Client} client 
     */
	async execute(ban, client) {
		if (!ban.guild.id) return;

		const config = await getLoggingConfig(client, ban.guild.id);
		if (!config) return;
		if (!config.enabled) return;

		if (!config.events.includes('guildBanAdd')) return;


		const channel = ban.guild.channels.cache.get(config.channelId);
		if (!channel) return;

		await channel.send({
			embeds: [
				new Embed(Colors.Red)
					.setDescription(`
                        **Member Banned**
                        ${ban.user} (${ban.user.username})
                        `)
					.setFooter({ text: `${ban.user.username}`, iconURL: `${ban.user.displayAvatarURL({ dynamic: true })}` })
			]
		});
	}
};