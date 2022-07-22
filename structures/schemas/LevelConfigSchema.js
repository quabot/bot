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

const LevelConfigSchema = new mongoose.Schema({
    guildId: reqString,
    levelEnabled: reqBool,
    levelUpChannel: reqString,
    levelUpMessage: reqString,
    levelUpEmbed: reqBool,
    levelExcludedChannels: reqArray,
    levelExcludedRoles: reqArray,
    levelCard: reqBool,
    levelRewards: reqArray,
});

module.exports = mongoose.model('Level-Config', LevelConfigSchema);
