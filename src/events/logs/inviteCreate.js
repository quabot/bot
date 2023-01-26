const { Client, Events, GuildEmoji, Colors, Invite } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.InviteCreate,
    name: "inviteCreate",
    /**
     * @param {Invite} invite
     * @param {Client} client 
     */
    async execute(invite, client) {

        const config = await getLoggingConfig(client, invite.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('inviteDelete')) return;
        if (config.excludedChannels.includes(invite.channel.id)) return;
        if (invite.channel.parentId && config.excludedCategories.includes(invite.channel.parentId)) return;


        const channel = invite.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        await channel.send({
            embeds: [
                new Embed(Colors.Red)
                    .setDescription(`**Invite Created**
                        [discord.gg/${invite.code}](https://discord.gg/${invite.code})
                        ${invite.inviter} - ${invite.channel}

                        **Expires in:**
                        ${invite.maxAge === 0 ? 'Never' : `<t:${Math.floor((new Date().getTime() / 1000) + invite.maxAge)}:R>`}
                        `)
            ]
        });
    }
}