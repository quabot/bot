const { ChannelType } = require('discord.js');

// Create the function to fetch the embed color.
async function getColor(guildId) {
    const Customization = require('../../structures/schemas/CustomizationSchema');
    const CustomizationDatabase = await Customization.findOne({
        guildId,
    }, (err, customization) => {
        if (err) console.log(err);
        if (!customization) {
            const newCustomization = new Customization({
                guildId,
                color: "#3a5a74"
            });
            newCustomization.save();
        }
    }).clone().catch((err => { }));

    if (!CustomizationDatabase) return;

    return CustomizationDatabase.color;
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

module.exports = { getColor, logChannelBlackList }
