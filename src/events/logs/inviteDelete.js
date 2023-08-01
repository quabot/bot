const { Client, Events, Colors, Invite } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.InviteDelete,
    name: "inviteDelete",
    /**
     * @param {Invite} invite
     * @param {Client} client 
     */
    async execute(invite, client) {
        if (!invite.guild.id) return;

        const config = await getLoggingConfig(client, invite.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.events.includes('inviteCreate')) return;
        if (config.excludedChannels.includes(invite.channel.id)) return;
        if (invite.channel.parentId && config.excludedCategories.includes(invite.channel.parentId)) return;


        const channel = invite.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        await channel.send({
            embeds: [
                new Embed(Colors.Red)
                    .setDescription(`
                    **Invite Deleted**
                    discord.gg/${invite.code}
                    ${invite.channel}`)
            ]
        });
    }
}