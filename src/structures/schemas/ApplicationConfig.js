const { Schema, model } = require("mongoose");
const { reqString, reqId, reqBool } = require("../../utils/constants/schemas");

const ApplicationConfig = new Schema({
    guildId: reqString,
    enabled: reqBool
});

module.exports = model('Application-Config', ApplicationConfig);