const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const BanSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    banReason: reqString,
    banTime: reqString,
});

module.exports = mongoose.model('Bans', BanSchema);