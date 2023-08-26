const UserGame = require('@schemas/UserGame');

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
					typeFastest: 15,

					quizTries: 0,
					quizPoints: 0,

					rpsTries: 0,
					rpsPoints: 0,

					bio: '-',
					birthday: {
						configured: false,
						day: 0,
						month: 0,
						year: 0
					}
				}).save();
		}
	).clone().catch(() => { });

	return userGame;
};

module.exports = { getUserGame };