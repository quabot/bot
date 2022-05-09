const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const LogSchema = new mongoose.Schema({
    guildId: reqString,
    logChannelID: reqString,
    moderation: reqBool,
    guildAdd: reqBool,
    guildRemove: reqBool,
    emojiCreateDelete: reqBool,
    emojiUpdate: reqBool,
    guildBanAdd: reqBool,
    guildBanRemove: reqBool,
    roleAdd: reqBool,
    nickChange: reqBool,
    boost: reqBool,
    guildUpdate: reqBool,
    inviteCreateDelete: reqBool,
    messageDelete: reqBool,
    messageDeleteBulk: reqBool,
    messageUpdate: reqBool,
    roleCreateDelete: reqBool,
    roleUpdate: reqBool,
    stickerCreateDelete: reqBool,
    stickerUpdate: reqBool,
    threadCreateDelete: reqBool,
    voiceMove: reqBool,
    voiceJoinLeave: reqBool,
});

module.exports = mongoose.model('Logs', LogSchema);