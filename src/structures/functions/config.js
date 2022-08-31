const Log = require('../../structures/schemas/LoggingSchema');
const JoinLeave = require('../../structures/schemas/JoinLeaveSchema');
const Verify = require('../../structures/schemas/VerificationSchema');
const Role = require('../../structures/schemas/JoinRoleSchema');
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
                leaveEmbed: [
                    {
                        title: "Goodbye {username}!",
                        description: "{user} left **{guild}**!",
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

    if (welcomeConfig.joinEnabled === false) return undefined;
    const welcomeChannel = guild.channels.cache.get(welcomeConfig.joinChannel);
    if (!welcomeChannel) return undefined;
    if (welcomeBlacklist.includes(welcomeChannel.type)) return undefined;

    return welcomeChannel;
}

async function getLeaveChannel(guild, welcomeConfig) {

    const leaveBlacklist = [
        ChannelType.DM,
        ChannelType.GroupDM,
        ChannelType.GuildCategory,
        ChannelType.GuildDirectory,
        ChannelType.GuildForum,
        ChannelType.GuildStageVoice,
        ChannelType.GuildVoice,
    ]

    if (welcomeConfig.leaveEnabled === false) return undefined;
    const leaveChannel = guild.channels.cache.get(welcomeConfig.leaveChannel);
    if (!leaveChannel) return undefined;
    if (leaveBlacklist.includes(leaveChannel.type)) return undefined;

    return leaveChannel;
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

async function getRolesConfig(client, guildId) {
    let roleConfig;

    if (client.cache.get(`${guildId}-roles-config`)) roleConfig = client.cache.get(`${guildId}-roles-config`);
    if (!roleConfig) roleConfig = await Role.findOne({
        guildId: guildId,
    }, (err, role) => {
        if (err) console.error(err);
        if (!role) {
            const newRole = new Role({
                guildId: guildId,
                roleEnabled: true,
                joinRoles: [],
            });
            newRole.save()
                .catch(err => {
                    console.log(err);
                });
        }
    }).clone().catch(function (err) { });

    client.cache.set(`${guildId}-roles-config`, roleConfig, 10000);

    return roleConfig;
}

module.exports = { getLeaveChannel, getLogConfig, getLogChannel, getWelcomeConfig, getWelcomeChannel, getVerifyConfig, getRolesConfig };