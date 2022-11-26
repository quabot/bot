import mongoose from 'mongoose';
import { reqString } from '../../utils/constants/schemas';

const SuggestSchema = new mongoose.Schema({
    guildId: reqString,
    id: reqString,
    msgId: reqString,
    suggestion: reqString,
    status: reqString,
    userId: reqString
});

module.exports = mongoose.model('Suggestion', SuggestSchema);