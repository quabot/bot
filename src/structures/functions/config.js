const Log = require('../../structures/schemas/LoggingSchema');
const { ChannelType } = require('discord.js');

async function getLogConfig(client, guildId) {
    let logConfig;

    if (client.cache.get(`${guildId}-log-config`)) logConfig = client.cache.get(`${guildId}-log-config`);

    if (!logConfig) logConfig = await Log.findOne({
        guildId: guildId,
    }, (err, log) => {
        if (err) console.error(err);
        if (!log) {
            const newLog = new Log({
                guildId: guildId,
                logChannelId: "none",
                logEnabled: true,
                enabledEvents: [
                    'emojiCreateDelete',
                    'emojiUpdate',
                    'guildBanAdd',
                    'guildBanRemove',
                    'roleAddRemove',
                    'nickChange',
                    'channelCreateDelete',
                    'channelUpdate',
                    'inviteCreateDelete',
                    'messageDelete',
                    'messageUpdate',
                    'roleCreateDelete',
                    'roleUpdate',
                    'stickerCreateDelete',
                    'stickerUpdate',
                    'threadCreateDelete',
                ],
                disabledEvents: [
                    'voiceMove',
                    'voiceJoinLeave',
                ]
            });
            newLog.save()
                .catch(err => {
                    console.log(err);
                });
        }
    }).clone().catch(function (err) { });
    client.cache.set(`${guildId}-log-config`, logConfig);

    return logConfig;
}

async function getLogChannel(guild, logConfig) {
    
    const logBlacklist = [
        ChannelType.DM,
        ChannelType.GroupDM,
        ChannelType.GuildCategory,
        ChannelType.GuildDirectory,
        ChannelType.GuildForum,
        ChannelType.GuildStageVoice,
        ChannelType.GuildVoice,
    ]

    if (logConfig.logEnabled === false) return undefined;
    const logChannel = guild.channels.cache.get(logConfig.logChannelId);
    if (!logChannel) return undefined;
    if (logBlacklist.includes(logChannel.type)) return undefined;

    return logChannel;
}

module.exports = { getLogConfig, getLogChannel };