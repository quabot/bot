const { Guild, ChannelType } = require('discord.js');
const { getApplicationConfig } = require('../../utils/configs/applicationConfig');
const { getAfkConfig } = require('../../utils/configs/afkConfig');
const { getGiveawayConfig } = require('../../utils/configs/giveawayConfig');
const { getLevelConfig } = require('../../utils/configs/levelConfig');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { getIdConfig } = require('../../utils/configs/idConfig');
const { getModerationConfig } = require('../../utils/configs/moderationConfig');
const { getPollConfig } = require('../../utils/configs/pollConfig');
const { getReactionConfig } = require('../../utils/configs/reactionConfig');
const { getResponderConfig } = require('../../utils/configs/responderConfig');
const { getServerConfig } = require('../../utils/configs/serverConfig');
const { getSuggestConfig } = require('../../utils/configs/suggestConfig');
const { getTicketConfig } = require('../../utils/configs/ticketConfig');
const { getWelcomeConfig } = require('../../utils/configs/welcomeConfig');
const { Embed } = require('../../utils/constants/embed');


module.exports = {
	event: "guildCreate",
	name: "guildCreate",
	/**
	 * @param {Guild} guild 
	 */
	async execute(guild, client) {
		console.log(`Joined ${guild.name} (${guild.id})`);
		await getAfkConfig(guild.id, client);
		await getApplicationConfig(guild.id, client);
		await getGiveawayConfig(client, guild.id);
		await getLevelConfig(guild.id, client);
		await getLoggingConfig(client, guild.id);
		await getIdConfig(guild.id);
		await getModerationConfig(client, guild.id);
		await getPollConfig(client, guild.id);
		await getReactionConfig(client, guild.id);
		await getResponderConfig(client, guild.id);
		await getServerConfig(client, guild.id);
		await getSuggestConfig(client, guild.id);
		await getTicketConfig(client, guild.id);
		await getWelcomeConfig(client, guild.id);

		let done = false;
		guild.channels.cache.forEach(channel => {
			if (channel.type === ChannelType.GuildText && !done && !channel.name.includes('rules') && !channel.name.includes('announcements') && !channel.name.includes('info') && !channel.name.includes('information')) {
				done = true;
				channel.send({
					embeds: [
						new Embed('#416683')
							.setTitle('Hi, I\'m QuaBot!')
							.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
							.setDescription("I'm a multipurpose Discord bot with loads of features. To configure me, go to [my dashboard](https://quabot.net/dashboard). If you need help with anything, join [my support server](https://discord.quabot.net).\nThanks for adding me to your server!")
					]
				}).catch(() => { done = false; });
			}
		});
	}
}