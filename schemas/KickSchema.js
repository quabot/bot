const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const KickSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    kickReason: reqString,
    kickId: reqString,
    kickedBy: reqString,
    kickChannel: reqString,
    active: reqBool,
});

module.exports = mongoose.model('Kicks', KickSchema);