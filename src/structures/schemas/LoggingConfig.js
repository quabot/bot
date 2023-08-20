const { Schema, model } = require('mongoose');
const { reqString, reqId, reqBool, reqArray } = require('../../utils/constants/schemas');

const LoggingConfig = new Schema({
	guildId: reqString,
	enabled: reqBool,
	channelId: reqString,
	excludedChannels: reqArray,
	excludedCategories: reqArray,
	events: reqArray
});

module.exports = model('Logging-Config', LoggingConfig);