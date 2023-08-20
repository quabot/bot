const { Schema, model } = require('mongoose');
const { reqString, reqBool, reqObject } = require('@constants/schemas');

const ModerationConfig = new Schema({
	guildId: reqString,
	channel: reqBool,
	channelId: reqString,

	warnDM: reqBool,
	warnDMMessage: reqObject,

	timeoutDM: reqBool,
	timeoutDMMessage: reqObject,

	kickDM: reqBool,
	kickDMMessage: reqObject,

	banDM: reqBool,
	banDMMessage: reqObject,

	tempbanDM: reqBool,
	tempbanDMMessage: reqObject
});

module.exports = model('Moderation-Config', ModerationConfig);
