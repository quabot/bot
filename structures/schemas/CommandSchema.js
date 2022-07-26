const { Schema, model } = require('mongoose');

module.exports = model("Commands", new Schema({
    guildId: String,
    funCommands: Array,
    infoCommands: Array,
    managementCommands: Array,
    moderationCommands: Array,
    funCommandsOn: Boolean,
    infoCommandsOn: Boolean,
    managementCommandsOn: Boolean,
    moderationCommandsOn: Boolean,
}))
