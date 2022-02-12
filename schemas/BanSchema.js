const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const banSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    banReason: reqString,
    banTime: reqString,
    banId: reqString,
    bannedBy: reqString,
    banChannel: reqString,
    active: reqBool,
});

module.exports = mongoose.model('Bans', banSchema);