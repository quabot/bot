const { Client } = require('discord.js');
const ResponderConfig = require('../../structures/schemas/ResponderConfig');

/**
 * @param {Client} client 
 */
const getResponderConfig = async (client, guildId) => {
    const responderConfig =
        client.cache.get(`${guildId}-responder-config`) ??

        (await ResponderConfig.findOne(
            { guildId },
            (err, c) => {
                if (err) console.log(err);
                if (!c)
                    new ResponderConfig({
                        guildId,
                        enabled: true
                    }).save();
            }
        ).clone().catch(() => { }));

    client.cache.set(`${guildId}-responder-config`, responderConfig);
    return responderConfig;
};

module.exports = { getResponderConfig };