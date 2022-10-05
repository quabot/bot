const { Client, EmbedBuilder, Colors, GuildBan, VoiceChannel } = require('discord.js');
const { getLogConfig, getLogChannel, getCustomizationConfig } = require('../../structures/functions/config');

module.exports = {
    event: "voiceStateUpdate",
    name: "voiceMove",
    /**
     * @param {VoiceChannel} oldState
     * @param {VoiceChannel} newState
     * @param {Client} client
     */
    async execute(oldState, newState, client) {

        if (!newState.guild) return;

        const logConfig = await getLogConfig(client, newState.guild.id);
        if (!logConfig) return;

        const logChannel = await getLogChannel(newState.guild, logConfig);
        if (!logChannel) return;

        if (!logConfig.enabledEvents.includes(this.name)) return;

        if (oldState.channelId === newState.channelId) return;
        if (!oldState.channelId || !newState.channelId) return;

        const user = newState.guild.members.cache.get(`${newState.id}`);
        if (!user) return;

        let color = "#3a5a74";
        const config = await getCustomizationConfig(client, newState.guild.id);
        if (config) color = config.color

        const embed = new EmbedBuilder()
            .setColor(color)
            .setDescription(`**${user} switched from <#${oldState.channelId}> to <#${newState.channelId}>**`)
            .setTimestamp()

        if (user.user.avatar) embed.setFooter({ text: `User: ${user.user.tag}`, iconURL: `${user.user.avatarURL({ dynamic: true })}` })

        logChannel.send({
            embeds: [embed]
        }).catch((e => { }));

    }
}