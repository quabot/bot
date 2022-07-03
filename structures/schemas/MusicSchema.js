const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const MusicSchema = new mongoose.Schema({
    guildId: reqString,
    musicEnabled: reqBool,
    oneChannel: reqString,
    oneChannelEnabled: reqBool,
    djRole: reqString,
    djEnabled: reqBool,
    djOnly: reqBool,
    djOnlyStop: reqBool,
    djOnlySkip: reqBool,
    djOnlyPause: reqBool,
    djOnlyResume: reqBool,
    djOnlyFilter: reqBool,
});

module.exports = mongoose.model('Music', MusicSchema);