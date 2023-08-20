const { Schema, model } = require('mongoose');
const { reqString, reqBool, reqArray, reqNum, optString } = require('../../utils/constants/schemas');

const ApplicationAnswer = new Schema({
	guildId: reqString,
	id: reqString, // Application ID
	response_uuid: reqString, // unique identifier for the response
	userId: optString, // user id or none if anonymous
	time: reqString, // time of fillout
	answers: reqArray, // the users answers
	state: reqString // pending, approved or denied
});

module.exports = model('Application-Answer', ApplicationAnswer);