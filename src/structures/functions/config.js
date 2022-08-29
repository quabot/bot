const Log = require('../../structures/schemas/LoggingSchema');
const JoinLeave = require('../../structures/schemas/JoinLeaveSchema');
const Verify = require('../../structures/schemas/VerificationSchema');
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
                    'emojiCreate',
                    'emojiDelete',
                    'emojiUpdate',
                    'guildBanAdd',
                    'guildBanRemove',
                    'roleAddRemove',
                    'nickChange',
                    'channelCreate',
                    'channelDelete',
                    'channelUpdate',
                    'inviteCreate',
                    'inviteDelete',
                    'messageDelete',
                    'messageUpdate',
                    'roleCreate',
                    'roleDelete',
                    'roleUpdate',
                    'stickerCreate',
                    'stickerDelete',
                    'stickerUpdate',
                    'threadCreate',
                    'threadDelete',
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
    client.cache.set(`${guildId}-log-config`, logConfig, 10000);

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

async function getWelcomeConfig(client, guildId) {
    let joinConfig;

    if (client.cache.get(`${guildId}-join-config`)) joinConfig = client.cache.get(`${guildId}-join-config`);
    if (!joinConfig) joinConfig = await JoinLeave.findOne({
        guildId: guildId,
    }, (err, joinleave) => {
        if (err) console.error(err);
        if (!joinleave) {
            const newJoinLeave = new JoinLeave({
                guildId: guildId,
                joinEnabled: true,
                leaveEnabled: true,
                joinChannel: "none",
                leaveChannel: "none",
                joinMessage: "Welcome {user} to **{guild}**!",
                joinEmbedBuilder: true,
                joinEmbed: [
                    {
                        title: "Welcome {username}!",
                        description: "Welcome to **{guild}**, {user}! You are the {members}th member.",
                        color: null,
                        authorText: "{tag}",
                        authorIcon: "{avatar}",
                        authorUrl: null,
                        footerText: null,
                        footerIcon: null,
                        timestamp: true,
                        url: null,
                        image: null,
                        thumbnail: null
                    }
                ],
                leaveMessage: "Goodbye {user}!",
                leaveEmbedBuilder: true,
                leaveEmbed: [],
                joinDM: false,
                joinDMMessage: "Welcome to {guild} {user}! Check out the rules in #rules!",
                joinDMEmbedBuilder: false,
                joinDMEmbed: [
                    {
                        title: null,
                        description: null,
                        color: null,
                        authorText: null,
                        authorIcon: null,
                        authorUrl: null,
                        footerText: null,
                        footerIcon: null,
                        timestamp: true,
                        url: null,
                        image: null,
                        thumbnail: null
                    }
                ],
                waitVerify: true,
            });
            newJoinLeave.save()
                .catch(err => {
                    console.log(err);
                });
        }
    }).clone().catch(function (err) { });

    client.cache.set(`${guildId}-join-config`, joinConfig, 10000);

    return joinConfig;
}

async function getWelcomeChannel(guild, welcomeConfig) {

    const welcomeBlacklist = [
        ChannelType.DM,
        ChannelType.GroupDM,
        ChannelType.GuildCategory,
        ChannelType.GuildDirectory,
        ChannelType.GuildForum,
        ChannelType.GuildStageVoice,
        ChannelType.GuildVoice,
    ]

    if (welcomeConfig.logEnabled === false) return undefined;
    const welcomeChannel = guild.channels.cache.get(welcomeConfig.joinChannel);
    if (!welcomeChannel) return undefined;
    if (welcomeBlacklist.includes(welcomeChannel.type)) return undefined;

    return welcomeChannel;
}

async function getVerifyConfig(client, guildId) {
    let verifyConfig;

    if (client.cache.get(`${guildId}-verify-config`)) verifyConfig = client.cache.get(`${guildId}-verify-config`);
    if (!verifyConfig) verifyConfig = await Verify.findOne({
        guildId: guildId,
    }, (err, verify) => {
        if (err) console.error(err);
        if (!verify) {
            const newVerify = new Verify({
                guildId: guildId,
                verifyEnabled: false,
                verifyLog: true,
                logChannel: "none",
                verifyChannel: "none",
                verifyMessage: "none",
                verifyRoles: [],
                verifyCode: true,
            });
            newVerify.save()
                .catch(err => {
                    console.log(err);
                });
        }
    }).clone().catch(function (err) { });

    client.cache.set(`${guildId}-verify-config`, verifyConfig, 10000);

    return verifyConfig;
}

module.exports = { getLogConfig, getLogChannel, getWelcomeConfig, getWelcomeChannel, getVerifyConfig };