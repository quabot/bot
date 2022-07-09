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

module.exports = { getColor }