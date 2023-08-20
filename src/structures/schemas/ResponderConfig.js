const { Schema, model } = require('mongoose');
const { reqString, reqBool } = require('../../utils/constants/schemas');

const ResponderConfig = new Schema({
	guildId: reqString,
	enabled: reqBool
});

module.exports = model('Responder-Config', ResponderConfig);