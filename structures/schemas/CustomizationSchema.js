const mongoose = require('mongoose');
const reqString = {
    type: String,
    required: true,
}

const CustomizationSchema = new mongoose.Schema({
    guildId: reqString,
    color: reqString,
});

module.exports = mongoose.model('Customization', CustomizationSchema);