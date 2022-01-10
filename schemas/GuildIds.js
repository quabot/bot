const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}

const GIdSchema = new mongoose.Schema({
    gId: reqString,
    verifyToken: reqNumber,
    suggestId: reqNumber,
    pollId: reqNumber,
    ticketId: reqNumber,
});

module.exports = mongoose.model('GIds', GIdSchema);