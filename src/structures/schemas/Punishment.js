const { Schema, model } = require("mongoose");
const { reqString, reqBool } = require("../../utils/constants/schemas");

const Punishment = new Schema({
    guildId: reqString,
    userId: reqString,

    channelId: reqString,
    moderatorId: reqString,
    time: reqString,
    
    type: reqString,
    id: reqString,
    reason: reqString,
    duration: reqString,
    active: reqBool
});

module.exports = model('Punishment', Punishment);
