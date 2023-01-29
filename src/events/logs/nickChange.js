const { Client, Events, Colors, GuildMember } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');

module.exports = {
    event: Events.GuildMemberUpdate,
    name: "nickChange",
    /**
     * @param {GuildMember} oldMember
     * @param {GuildMember} newMember
     * @param {Client} client 
     */
    async execute(oldMember, newMember, client) {

        const config = await getLoggingConfig(client, oldMember.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('nickChange')) return;


        const channel = oldMember.guild.channels.cache.get(config.channelId);
        if (!channel) return;
        
        if (oldMember.nickName === newMember.nickname) return;
        if (!oldMember.nickName && !newMember.nickname) return;

        await channel.send({
            embeds: [
                new Embed(Colors.Yellow)
                    .setDescription(`
                        **Nickname Changed**
                        **User:** ${newMember}
                        ${oldMember.nickname ?? 'None'} -> ${newMember.nickname ?? 'None'}
                        `)
                    .setFooter({ text: `${newMember.user.tag}`, iconURL: `${newMember.user.displayAvatarURL({ dynamic: true })}` })
            ]
        });
    }
}