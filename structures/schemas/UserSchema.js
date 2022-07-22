const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const UserSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    quizScore: reqNum,
    quizWins: reqNum,
    quizLoses: reqNum,
    typeScore: reqNum,
    typeWins: reqNum,
    typeLoses: reqNum,
    rpsScore: reqNum,
    rpsWins: reqNum,
    rpsLoses: reqNum,
});

module.exports = mongoose.model('User', UserSchema);