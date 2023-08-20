const { Schema, model } = require('mongoose');
const { reqString, reqId, reqBool } = require('../../utils/constants/schemas');

const AfkConfig = new Schema({
	guildId: reqString,
	enabled: reqBool
});

module.exports = model('Afk-Config', AfkConfig);