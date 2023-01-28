const Ids = require('../../structures/schemas/Ids');

const getIdConfig = async (guildId) => {
    const idConfig = await Ids.findOne(
        { guildId },
        (err, ids) => {
            if (err) console.log(err);
            if (!ids)
                new Ids({
                    guildId,
                    locale: 'en-us',
                    color: '#3a5a74',
                    updatesChannel: 'none',
                }).save();
        }
    ).clone().catch(() => { });

    return idConfig;
};

module.exports = { getIdConfig };