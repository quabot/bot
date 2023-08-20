const { Schema, model } = require('mongoose');
const { reqString, reqNum, reqBool } = require('@constants/schemas');

const User = new Schema({
	guildId: reqString,
	userId: reqString,

	bans: reqNum,
	tempbans: reqNum,
	warns: reqNum,
	kicks: reqNum,
	timeouts: reqNum,

	afk: reqBool,
	afkMessage: reqString
});

module.exports = model('User', User);
