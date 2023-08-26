const { Schema, model } = require('mongoose');
const { reqString, reqNum, reqBool, reqObject, reqArray } = require('@constants/schemas');

const TicketConfig = new Schema({
	guildId: reqString,

	enabled: reqBool, 
	openCategory: reqString,
	closedCategory: reqString,

	staffRoles: reqArray,
	staffPing: reqString,
	topicButton: reqBool,

	logChannel: reqString,
	logEnabled: reqBool,
});

module.exports = model('Ticket-Config', TicketConfig);