const { Client, Events, Colors, Message } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.MessageDelete,
    name: "messageDelete",
    /**
     * @param {Message} message
     * @param {Client} client 
     */
    async execute(message, client) {

        const config = await getLoggingConfig(client, message.guildId);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('messageDelete')) return;
        if (config.excludedChannels.includes(message.channelId)) return;
        if (config.excludedCategories.includes(message.channel.parentId)) return;


        const channel = message.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        let description = '';
        if (message.content) description += message.content.slice(0, 1002);

		try {
			if (message.author.bot) return;
		} catch (e) { }

        const embed = new Embed(Colors.Red)
            .setDescription(`
            **Message Deleted**
            ${description}
            `)
            .addFields({ name: 'Channel', value: `${message.channel}`, inline: true })
            .setFooter({
                text: `User: @${message.author.username}`,
                iconURL: `${message.author.avatarURL({ dynamic: true })}`,
            });


        const attachments = [];
        message.attachments.map(i => attachments.push(i.url));
        if (attachments.length !== 0) embed.addFields(
            { name: '**Attachments**', value: `${attachments.join('\n')}`.slice(0, 1024) }
        );


        await channel.send({
            embeds: [embed]
        });
    }
}