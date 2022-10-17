const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNum = {
    type: Number,
    required: true,
};

const PunishmentSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    banId: reqNum,
    kickId: reqNum,
    timeoutId: reqNum,
    warnId: reqNum,
});

module.exports = mongoose.model('Punishment', PunishmentSchema);
