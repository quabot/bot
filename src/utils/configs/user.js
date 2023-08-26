const User = require('@schemas/User');

const getUser = async (guildId, userId) => {
	const user = await User.findOne(
		{ guildId, userId },
		(err, document) => {
			if (err) console.log(err);
			if (!document)
				new User({
					guildId,
					userId,
					bans: 0,
					tempbans: 0,
					warns: 0,
					kicks: 0,
					timeouts: 0,

					afk: false,
					afkMessage: 'No afk message set.'
				}).save();
		}
	).clone().catch(() => { });

	return user;
};

module.exports = { getUser };