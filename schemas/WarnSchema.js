const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const WarnSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    warnReason: reqString,
    warnTime: reqString,
});

module.exports = mongoose.model('Warns', WarnSchema);