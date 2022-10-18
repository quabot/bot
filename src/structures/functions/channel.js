const { ChannelType } = require('discord.js');

function checkChannel(channelType) {
    const validChannels = [
        ChannelType.GuildNews,
        ChannelType.GuildText,
        ChannelType.GuildForum,
        ChannelType.GuildNewsThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildPublicThread,
        ChannelType.GuildVoice,
    ];

    return validChannels.includes(channelType);
}

module.exports = { checkChannel };
