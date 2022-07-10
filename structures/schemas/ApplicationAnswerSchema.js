const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const ApplicationAnswerSchema = new mongoose.Schema({
    guildId: reqString,
    applicationId: reqString,
    applicationUserId: reqString,
    applicationAnswers: reqArray,
    applicationState: reqString,
});

module.exports = mongoose.model('Application-Answer', ApplicationAnswerSchema);