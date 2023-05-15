const Level = require('../../structures/schemas/Level');

const getLevel = async (guildId, userId) => {
    const levelConfig = await Level.findOne(
        { guildId, userId },
        (err, config) => {
            if (err) console.log(err);
            if (!config)
                new Level({
                    guildId,
                    userId,
                    xp: 0,
                    level: 0,
                    role: 'none',
                    lastVote: '0'
                }).save();
        }
    ).clone().catch(() => { });

    return levelConfig;
};

module.exports = { getLevel };