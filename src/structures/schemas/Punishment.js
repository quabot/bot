const { Schema, model } = require("mongoose");
const { reqString } = require("../../utils/constants/schemas");

const Punishment = new Schema({
    guildId: reqString,
    userId: reqString,

    channelId: reqString,
    moderatorId: reqString,
    time: reqString,
    
    type: reqString,
    id: reqString,
    reason: reqString,
    duration: reqString
});

module.exports = model('Punishment', Punishment);
