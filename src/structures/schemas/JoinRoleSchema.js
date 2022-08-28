const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqArray = {
    type: Array,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const JoinRoleSchema = new mongoose.Schema({
    guildId: reqString,
    roleEnabled: reqBool,
    joinRoles: reqArray,
});

module.exports = mongoose.model('joinrole', JoinRoleSchema);