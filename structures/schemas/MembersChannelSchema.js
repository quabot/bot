const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const MembersChannelSchema = new mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    channelName: reqString,
    channelEnabled: reqBool
});

module.exports = mongoose.model('Members-Channel-Config', MembersChannelSchema);
