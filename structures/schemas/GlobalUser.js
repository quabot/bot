const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const GlobalUserSchema = new mongoose.Schema({
    userId: reqString,
    updateNotify: reqBool,
    lastNotify: reqString,
});

module.exports = mongoose.model('GlobalUser', GlobalUserSchema);