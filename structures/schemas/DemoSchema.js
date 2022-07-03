const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const reqNumber = {
    type: Number,
    required: true,
}

const DemoSchema = new mongoose.Schema({
    guildId: reqString,
    stringItem: reqString,
    booleanItem: reqBool,
    numberItem: reqNumber,
});

module.exports = mongoose.model('Demo', DemoSchema);