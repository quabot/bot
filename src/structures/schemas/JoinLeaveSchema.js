const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const reqArray = {
    type: Array,
    required: true,
};

const reqBool = {
    type: Boolean,
    required: true,
};

const JoinLeaveSchema = new mongoose.Schema({
    guildId: reqString,
    joinEnabled: reqBool,
    leaveEnabled: reqBool,
    joinChannel: reqString,
    leaveChannel: reqString,

    joinMessage: reqString, // Only for the text based messages
    joinEmbedBuilder: reqBool,
    joinEmbed: reqArray, // join msg for embed msgs

    leaveMessage: reqString, // Only for the text based messages
    leaveEmbedBuilder: reqBool,
    leaveEmbed: reqArray, // leave msg for embed msgs

    joinDM: reqBool,
    joinDMMessage: reqString, // only for text
    joinDMEmbedBuilder: reqBool,
    joinDMEmbed: reqArray, // join dm embed

    waitVerify: reqBool,
});

module.exports = mongoose.model('joinleave-config', JoinLeaveSchema);
