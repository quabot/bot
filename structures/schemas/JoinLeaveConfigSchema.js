const mongoose = require('mongoose');

const reqString = {
    type: String,
    required: true,
}

const reqNum = {
    type: Number,
    required: true,
}

const reqBool = {
    type: Boolean,
    required: true,
}

const ApplicationConfigSchema = new mongoose.Schema({
    guildId: reqString,
    joinEnabled: reqBool,
    leaveEnabled: reqBool,
    messageEmbed: reqBool,
    joinColor: reqString,
    leaveColor: reqString,
    joinMessage: reqString,

    joinEmbedTitle: reqString,
    leaveEmbedTitle: reqString,
    joinEmbedTitleEnabled: reqBool,
    leaveEmbedTitleEnabled: reqBool,

    joinEmbedAuthor: reqBool,
    leaveEmbedAuthor: reqBool,
    joinEmbedAuthorText: reqString,
    leaveEmbedAuthorText: reqString,
    joinEmbedAuthorIcon: reqString,
    leaveEmbedAuthorIcon: reqString,
    
    joinEmbedFooter: reqBool,
    leaveEmbedFooter: reqBool,
    joinEmbedFooterText: reqString,
    leaveEmbedFooterText: reqString,
    joinEmbedFooterIcon: reqString,
    leaveEmbedFooterIcon: reqString,


    leaveMessage: reqString,
    joinChannel: reqString,
    leaveChannel: reqString,
    joinRole: reqString,
    joinRoleEnabled: reqBool,
    joinRoleCooldown: reqNum,

    joinDM: reqBool,
    joinDMContent: reqString,
    joinDMEmbed: reqBool,
    joinDMColor: reqString,
    joinDMEmbedTitle: reqString,
    joinDMEmbedTitleEnabled: reqBool
});

module.exports = mongoose.model('joinleave-config', ApplicationConfigSchema);