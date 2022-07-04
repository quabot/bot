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
    djOnlyPlay: reqBool,
    djOnlySearch: reqBool,
    djOnlyQueue: reqBool,
    djOnlyRepeat: reqBool,
    djOnlyVolume: reqBool,
    djOnlySeek: reqBool,
    djOnlyShuffle: reqBool,
    djOnlyAutoplay: reqBool,
});

module.exports = mongoose.model('Music', MusicSchema);