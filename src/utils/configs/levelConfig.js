const Level = require('../../structures/schemas/LevelConfig');

const getLevelConfig = async (guildId, client) => {
    const levelConfig =
        client.cache.get(`${guildId}-level-config`) ??

        (await Level.findOne(
            { guildId },
            (err, config) => {
                if (err) console.log(err);
                if (!config)
                    new Level({
                        guildId,
                        enabled: false,
                        channel: 'disabled',
                        messageEmbed: true,
                        message: {
                            content: '',
                            title: '{tag} leveled up!',
                            color: '{color}',
                            timestamp: true,
                            footer: {
                                text: '',
                                icon: '',
                            },
                            author: {
                                text: '',
                                icon: '',
                                url: '',
                            },
                            description: '{user} is now level **{level}** with **{xp}** xp!',
                            fields: [],
                            url: '',
                            thumbnail: '{avatar}',
                            image: '',
                        },
                    
                        dmMessageEnabled: false, // if true, the message will be sent in dms (as well)
                        dmMessageEmbed: true,
                        dmMessage: {
                            content: '',
                            title: '{tag} leveled up!',
                            color: '{color}',
                            timestamp: true,
                            footer: {
                                text: '',
                                icon: '',
                            },
                            author: {
                                text: '',
                                icon: '',
                                url: '',
                            },
                            description: '{user} is now level **{level}** with **{xp}** xp!',
                            fields: [],
                            url: '',
                            thumbnail: '{avatar}',
                            image: '',
                        },
                        
                        excludedChannels: [], 
                        excludedRoles: [],
                        rewards: []
                    }).save();
            }
        ).clone().catch(() => { }));

    client.cache.set(`${guildId}-level-config`, levelConfig);
    return levelConfig;
};

module.exports = { getLevelConfig };