const { Schema, model } = require('mongoose');
const { reqString, reqArray, reqNum, optString } = require('@constants/schemas');

const Poll = new Schema({
	guildId: reqString,
	id: reqNum,
	channel: reqString,
	message: reqString,
	interaction: reqString,
	role: optString,

	topic: reqString,
	description: reqString,

	duration: reqString,
	optionsCount: reqNum,
	options: reqArray,

	created: reqString,
	endTimestamp: reqString,
});

module.exports = model('Poll', Poll);