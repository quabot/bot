const { Client, Events, Colors, Message } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.MessageUpdate,
    name: "messageUpdate",
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client 
     */
    async execute(oldMessage, newMessage, client) {
		try {
			if (!newMessage.guild.id) return;
		} catch (e) { }

        const config = await getLoggingConfig(client, newMessage.guildId);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('messageUpdate')) return;
        if (config.excludedChannels.includes(newMessage.channelId)) return;
        if (config.excludedCategories.includes(newMessage.channel.parentId)) return;

        const channel = newMessage.guild.channels.cache.get(config.channelId);
        if (!channel) return;


		try {
			if (oldMessage.author.bot) return;
		} catch (e) { }
        
        const embed = new Embed(Colors.Yellow)
            .setDescription(`**Message Edited**
            ${newMessage.channel} - [Jump to Message](${newMessage.url})`);


        if ((!oldMessage.content || oldMessage.content === '') && oldMessage.attachments === null && newMessage.attachments === null) return;
        if (oldMessage.content !== newMessage.content) {
            embed.addFields(
                { name: 'Old Content', value: `${oldMessage.content}`.slice(0, 1020) },
                { name: 'New Content', value: `${newMessage.content}`.slice(0, 1020) },
            )
        }

        if (newMessage.author) embed.setFooter({
            text: `@${newMessage.author.username}`,
            iconURL: `${newMessage.author.avatarURL({ dynamic: true }) ?? 'https://i.imgur.com/VUwD8zP.png'}`
        });


        const oldAttachments = [];
        oldMessage.attachments.map(i => oldAttachments.push(i.url));

        const newAttachments = [];
        newMessage.attachments.map(i => newAttachments.push(i.url));

        
        if (oldAttachments.length > newAttachments.length && oldMessage.attachments !== newMessage.attachments) embed.addFields(
            { name: '**Attachments**', value: `${oldAttachments.join('\n')}`.slice(0, 1024) }
        );


        await channel.send({
            embeds: [embed]
        });
    }
}