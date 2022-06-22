const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const LogSchema = new mongoose.Schema({
    guildId: reqString,
    enabled: reqArray,
    disabled: reqArray,
});

module.exports = mongoose.model('Logs', LogSchema);