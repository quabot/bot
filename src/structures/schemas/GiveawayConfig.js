const { Schema, model } = require('mongoose');
const { reqString, reqId, reqBool } = require('@constants/schemas');

const GiveawayConfig = new Schema({
	guildId: reqString,
	enabled: reqBool,
	pingEveryone: reqBool
});

module.exports = model('Giveaway-Config', GiveawayConfig);