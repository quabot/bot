const { Schema, model } = require('mongoose');
const { reqString, reqId, reqBool, reqNum } = require('../../utils/constants/schemas');

const Giveaway = new Schema({
	guildId: reqString,
	id: reqNum,

	prize: reqString,
	winners: reqNum,

	channel: reqString,
	message: reqString,
	host: reqString,

	endTimestamp: reqString,
	ended: reqBool
});

module.exports = model('Giveaway', Giveaway);