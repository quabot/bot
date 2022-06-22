const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqInt = {
    type: Number,
    required: true,
}

const UserSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    xp: reqInt,
    level: reqInt,
    role: reqString,
});

module.exports = mongoose.model('Level', UserSchema);