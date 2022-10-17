const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
};

const ReactionRoleSchema = new mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    reqPermission: reqString,
    roleId: reqString,
    messageId: reqString,
    emoji: reqString,
    type: reqString,
});

module.exports = mongoose.model('ReactionRole', ReactionRoleSchema);
