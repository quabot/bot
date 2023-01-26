const { Client, Events, GuildBan, Colors } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.GuildBanAdd,
    name: "guildBanAdd",
    /**
     * @param {GuildBan} ban
     * @param {Client} client 
     */
    async execute(ban, client) {

        const config = await getLoggingConfig(client, ban.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('guildBanAdd')) return;


        const channel = ban.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        await channel.send({
            embeds: [
                new Embed(Colors.Red)
                    .setDescription(`
                        **Member Banned**
                        ${ban.user} (${ban.user.tag})
                        `)
                    .setFooter({ text: `${ban.user.tag}`, iconURL: `${ban.user.displayAvatarURL({ dynamic: true })}` })
            ]
        });
    }
}