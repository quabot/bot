const { ChannelType } = require("discord.js");

function checkChannel(channelType) {
    const validChannels = [
        ChannelType.GuildNews,
        ChannelType.GuildText,
        ChannelType.GuildForum,
        ChannelType.GuildNewsThread,
        ChannelType.GuildPrivateThread,
        ChannelType.GuildPublicThread,
        ChannelType.GuildVoice
    ]

    if (validChannels.includes(channelType)) return true;
    if (!validChannels.includes(channelType)) return false;
}

module.exports = { checkChannel }