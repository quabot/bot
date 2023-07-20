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
                        channel: 'none', // none, current, other
                    
                        messageType: 'embed', // Embed, Text or card
                        levelCard: {no:'no'},
                        messageText: '{user} leveled up to level {level}!',
                        message: {
                            content: '',
                            title: '@{username} leveled up!',
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
                    
                        dmMessageEnabled: false,
                        dmMessageEmbed: true,
                        dmMessageText: 'You leveled up in {server} to level {level}!',
                        dmMessage: {
                            content: '',
                            title: '@{username} leveled up!',
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
                    
                        voiceXp: true,
                        voiceXpMultiplier: 1,
                        xpMultiplier: 1,
                        
                        excludedChannels: [], 
                        excludedRoles: [],
                    
                        rewards: [],
                        rewardsMode: 'stack',
                    }).save();
            }
        ).clone().catch(() => { }));

    client.cache.set(`${guildId}-level-config`, levelConfig);
    return levelConfig;
};

module.exports = { getLevelConfig };