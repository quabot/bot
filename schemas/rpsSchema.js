const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const rpsSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    messageId: reqString,
    result: reqString,
});

module.exports = mongoose.model('Rps', rpsSchema);