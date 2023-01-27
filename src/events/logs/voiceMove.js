const { Client, Events, Colors, ThreadChannel, VoiceState } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');
const { channelTypesById } = require('../../utils/constants/discord');

module.exports = {
    event: Events.VoiceStateUpdate,
    name: "voiceMove",
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client 
     */
    async execute(oldState, newState, client) {

        const config = await getLoggingConfig(client, oldState.guild.id);
        if (!config) return;
        if (!config.enabled) return;

        if (!config.enabledEvents.includes('voiceJoinLeave')) return;
        if (newState.channelId && (config.excludedCategories.includes(newState.channel.parentId) || config.excludedChannels.includes(newState.channelId))) return;
        if (oldState.channelId && (config.excludedCategories.includes(oldState.channel.parentId) || config.excludedChannels.includes(oldState.channelId))) return;


        const channel = newState.guild.channels.cache.get(config.channelId);
        if (!channel) return;


        if (!oldState.channelId || !newState.channelId) return;
            
        await channel.send({ embeds: [
            new Embed(Colors.Yellow)
                .setDescription(`**User Moved**\n${newState.member} switched from ${oldState.channel} to ${newState.channel}`)
        ]});
    }
}