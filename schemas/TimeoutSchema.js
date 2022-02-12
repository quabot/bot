const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    required: true,
}

const TimeoutSchema = new mongoose.Schema({
    guildId: reqString,
    guildName: reqString,
    userId: reqString,
    timeoutReason: reqString,
    timeoutId: reqString,
    timedoutTime: reqString,
    timedoutBy: reqString,
    timeoutChannel: reqString,
    active: reqBool,
});

module.exports = mongoose.model('Timeouts', TimeoutSchema);