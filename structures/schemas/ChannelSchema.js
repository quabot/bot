const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}


const ChannelSchema = new mongoose.Schema({
    guildId: reqString,
    punishmentChannelId: reqString,
});

module.exports = mongoose.model('Channel', ChannelSchema);