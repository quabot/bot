const mongoose = require('mongoose');
const reqBool = {
    type: Boolean,
    required: true,
}
const reqString = {
    type: String,
    required: true,
}

const EventsSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    joinMessages: reqBool,
    leaveMessages: reqBool,
    channelCreateDelete: reqBool,
    channelUpdate: reqBool,
    emojiCreateDelete: reqBool,
    emojiUpdate: reqBool,
    inviteCreateDelete: reqBool,
    messageDelete: reqBool,
    messageUpdate: reqBool,
    roleCreateDelete: reqBool,
    roleUpdate: reqBool,
    voiceState: reqBool,
    voiceMove: reqBool,
    memberUpdate: reqBool,
    quabotLogging: reqBool,
});

module.exports = mongoose.model('Events', EventsSchema);