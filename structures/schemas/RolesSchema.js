const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const RoleSchema = new mongoose.Schema({
    guildId: reqString,
    reactionRoles: reqArray,
    memberRole: reqString,
    welcomeRole: reqString,
});

module.exports = mongoose.model('Role', RoleSchema);