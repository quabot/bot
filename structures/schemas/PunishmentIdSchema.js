const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const PunishmentIdSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    warnId: reqNum,
    kickId: reqNum,
    banId: reqNum,
    timeoutId: reqNum,
});

module.exports = mongoose.model('PunishmentId', PunishmentIdSchema);