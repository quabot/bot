import mongoose from 'mongoose';
import { reqString } from '../../utils/constants/schemas';

const ServerSchema = new mongoose.Schema({
    guildId: reqString,
    locale: reqString,
    color: reqString,
    updatesChannel: reqString,
});

module.exports = mongoose.model('Server', ServerSchema);
