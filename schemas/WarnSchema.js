const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const WarnSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    warnReason: reqString,
    warnTime: reqString,
    warnId: reqString,
    warnedBy: reqString,
    warnChannel: reqString,
    active: reqBool,
});

module.exports = mongoose.model('Warns', WarnSchema);