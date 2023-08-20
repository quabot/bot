const { Schema, model } = require('mongoose');
const { reqString, reqArray } = require('../../utils/constants/schemas');

const ReactionRole = new Schema({
	guildId: reqString,
	channelId: reqString,
	reqPermission: reqString,
	reqRoles: reqArray,
	excludedRoles: reqArray,
	roleId: reqString,
	messageId: reqString,
	emoji: reqString,
	type: reqString
});

module.exports = model('Reaction-Roles', ReactionRole);