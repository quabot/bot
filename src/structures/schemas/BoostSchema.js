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

const BoostSchema = new mongoose.Schema({
    guildId: reqString,
    boostEnabled: reqBool,
    boostChannel: reqString,

    boostMessage: reqString, // Only for the text based messages
    boostEmbedBuilder: reqBool,
    boostEmbed: reqArray, // join msg for embed msgs
});

module.exports = mongoose.model('boost-config', BoostSchema);
