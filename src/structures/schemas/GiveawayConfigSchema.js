const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqNum = {
    type: Number,
    required: true,
};

const GiveawayConfigSchema = new mongoose.Schema({
    guildId: reqString,
    giveawayID: reqNum,
});

module.exports = mongoose.model('giveaway-config', GiveawayConfigSchema);
