const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const RewardSchema = new mongoose.Schema({
    guildId: reqString,
    level: reqNum,
    role: reqString,
});

module.exports = mongoose.model('Rewards', RewardSchema);