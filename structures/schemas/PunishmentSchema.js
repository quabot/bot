const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const PunishmentSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    type: reqString,
    punishmentId: reqNum,
    channelId: reqString,
    userExecuteId: reqString,
    reason: reqString,
    time: reqString,
});

module.exports = mongoose.model('Punishment', PunishmentSchema);