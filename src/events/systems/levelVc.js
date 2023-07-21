const { Client, Events, Colors, ThreadChannel, VoiceState } = require('discord.js');
const { getLoggingConfig } = require('../../utils/configs/loggingConfig');
const { Embed } = require('../../utils/constants/embed');
const { channelTypesById } = require('../../utils/constants/discord');
const { getLevelConfig } = require('../../utils/configs/levelConfig');
const { getLevel } = require('../../utils/configs/level');

module.exports = {
    event: Events.VoiceStateUpdate,
    name: "voiceJoinLeave",
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client 
     */
    async execute(oldState, newState, client) {

        if (oldState.member.user.bot || newState.member.user.bot) return;

        const config = await getLevelConfig(newState.guild.id, client);
        if (!config) return;
        if (!config.enabled) return;
        if (config.excludedChannels.includes(newState.channelId)) return;

        for (let i = 0; i < config.excludedRoles.length; i++) {
            const role = config.excludedRoles[i];
            if (newState.member.roles.cache.has(role)) return;
        }


        if (oldState.channelId && newState.channelId) return;

        const levelDB = await getLevel(newState.guild.id, newState.member.id);
        if (!levelDB) return;

        if (!oldState.channelId) {

            //!map of users in loop rn
            (function loop() {
                setTimeout(function () {
                    if (newState.member.voice.channelId === null) {
                        console.log('not in vc anymore lmfao');
                        return
                    }

                    if (newState.member.voice.selfMute) {
                        console.log('muted');
                    } else if (newState.member.voice.selfDeaf) {
                        console.log('deafened');
                    } else if (newState.member.voice.deaf) {
                        console.log('server deafened');
                    } else if (newState.member.voice.channel.members.size === 1) {
                        console.log('only 1 user')
                    } else {
                        //todo: make cool system
                    }
                    loop();
                }, 5000);
            })()
        }
    }
}