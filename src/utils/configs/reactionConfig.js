/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const Config = require('../../structures/schemas/ReactionConfig');

/**
 * @param {Client} client 
 */
const getReactionConfig = async (client, guildId) => {
	const reactionConfig =
        client.cache.get(`${guildId}-reaction-config`) ??

        (await Config.findOne(
        	{ guildId },
        	(err, config) => {
        		if (err) console.log(err);
        		if (!config)
        			new Config({
        				guildId,
        				enabled: true,
        				dmEnabled: false,
        				dm: {
        					content: '',
        					title: 'Role {action}',
        					color: '{color}',
        					timestamp: true,
        					footer: {
        						text: '',
        						icon: '',
        					},
        					author: {
        						text: '',
        						icon: '',
        						url: '',
        					},
        					description: 'Your role ({role}) in **{server}** has been {action}.',
        					fields: [],
        					url: '',
        					thumbnail: '',
        					image: '',
        				}
        			}).save();
        	}
        ).clone().catch(() => { }));

	client.cache.set(`${guildId}-reaction-config`, reactionConfig);
	return reactionConfig;
};

module.exports = { getReactionConfig };