const mongoose = require('mongoose');
const { isBooleanObject } = require('util/support/types');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const LevelVoteSchema = new mongoose.Schema({
    userId: reqString,
    lastVote: reqString,
});

module.exports = mongoose.model('Votes', LevelVoteSchema);