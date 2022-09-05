const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const LevelSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    xp: reqNum, 
    level: reqNum,
    role: reqString
});

module.exports = mongoose.model('Level', LevelSchema);