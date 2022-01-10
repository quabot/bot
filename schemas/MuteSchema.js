const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const MuteSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    muteReason: reqString,
    muteTime: reqString,
});

module.exports = mongoose.model('Mutes', MuteSchema);