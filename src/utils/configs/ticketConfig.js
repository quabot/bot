/* eslint-disable no-mixed-spaces-and-tabs */
const { Client } = require('discord.js');
const TicketConfig = require('@schemas/TicketConfig');

/**
 * @param {Client} client 
 */
const getTicketConfig = async (client, guildId) => {
	const ticketConfig =
        client.cache.get(`${guildId}-ticket-config`) ??

        (await TicketConfig.findOne(
        	{ guildId },
        	(err, ticket) => {
        		if (err) console.log(err);
        		if (!ticket)
        			new TicketConfig({
        				guildId,
                    
        				enabled: false, 
        				openCategory: 'none',
        				closedCategory: 'none',
                    
        				staffRoles: [],
        				staffPing: 'none',
        				topicButton: true,
                    
        				logChannel: 'none',
        				logEnabled: false
        			}).save();
        	}
        ).clone().catch(() => { }));

	client.cache.set(`${guildId}-ticket-config`, ticketConfig);
	return ticketConfig;
};

module.exports = { getTicketConfig };