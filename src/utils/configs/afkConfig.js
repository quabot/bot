const Afk = require('../../structures/schemas/AfkConfig');

const getAfkConfig = async (guildId, client) => {
    const afkConfig =
        client.cache.get(`${guildId}-afk-config`) ??

        (await Afk.findOne(
            { guildId },
            (err, config) => {
                if (err) console.log(err);
                if (!config)
                    new Afk({
                        guildId,
                        enabled: true
                    }).save();
            }
        ).clone().catch(() => { }));

    client.cache.set(`${guildId}-afk-config`, afkConfig);
    return afkConfig;
};

module.exports = { getAfkConfig };