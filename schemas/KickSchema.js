const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const KickSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    kickReason: reqString,
    kickTime: reqString,
});

module.exports = mongoose.model('Kicks', KickSchema);