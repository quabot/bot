const { Client, EmbedBuilder, Colors, GuildBan, VoiceChannel } = require('discord.js');
const { getLogConfig, getLogChannel } = require('../../structures/functions/config');

module.exports = {
    event: "voiceStateUpdate",
    name: "voiceJoinLeave",
    /**
     * @param {VoiceChannel} oldState
     * @param {VoiceChannel} newState
     * @param {Client} client
     */
    async execute(oldState, newState, client, color) {

        if (!newState.guild) return;

        const logConfig = await getLogConfig(client, newState.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newState.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.name)) return;

        if (oldState.channelId && newState.channelId) return;

        const user = newState.guild.members.cache.get(`${newState.id}`);
        if (!user) return;

        if (oldState.channelId) {
            const embed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setDescription(`**${user} left <#${oldState.channelId}>**`)
                .setTimestamp()

            if (user.user.avatar) embed.setFooter({ text: `User: ${user.user.tag}`, iconURL: `${user.user.avatarURL({ dynamic: true })}` });
            
            logChannel.send({
                embeds: [embed]
            }).catch((err => { }));

        } else {
            const embed = new EmbedBuilder()
            .setColor(Colors.Green)
                .setDescription(`**${user} joined <#${newState.channelId}>**`)
                .setTimestamp()

            if (user.user.avatar) embed.setFooter({ text: `User: ${user.user.tag}`, iconURL: `${user.user.avatarURL({ dynamic: true })}` })

            logChannel.send({
                embeds: [embed]
            }).catch((err => { }));
        }
    }
}