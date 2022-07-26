const { ChannelType } = require('discord.js');

// Create the function to fetch the embed color.
async function getColor(guildId) {
    return "#3a5a74";
}

    

const logChannelBlackList = [
    ChannelType.DM,
    ChannelType.GroupDM,
    ChannelType.GuildCategory,
    ChannelType.GuildDirectory,
    ChannelType.GuildForum,
    ChannelType.GuildStageVoice,
    ChannelType.GuildVoice,
]

const channelBlackList = [
    ChannelType.GuildDirectory,
    ChannelType.GuildForum,
]

module.exports = { getColor, logChannelBlackList, channelBlackList }
