const UserGame = require('../../structures/schemas/UserGame');

const getUserGame = async (userId) => {
    const userGame = await UserGame.findOne(
        { userId },
        (err, document) => {
            if (err) console.log(err);
            if (!document)
                new UserGame({
                    userId,
                    typePoints: 0,
                    typeTries: 0,
                    
                    quizTries: 0,
                    quizPoints: 0
                }).save();
        }
    ).clone().catch(() => { });

    return userGame;
};

module.exports = { getUserGame };