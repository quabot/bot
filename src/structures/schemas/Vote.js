const { Schema, model } = require('mongoose');
const { reqString } = require('../../utils/constants/schemas');

const VoteSchema = new Schema({
	userId: reqString,
	lastVote: reqString
});

module.exports = model('Vote', VoteSchema);