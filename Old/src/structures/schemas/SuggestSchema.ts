import mongoose from 'mongoose';
import { reqNum, reqString } from '../../utils/constants/schemas';

const SuggestSchema = new mongoose.Schema({
    guildId: reqString,
    id: reqNum,
    msgId: reqString,
    suggestion: reqString,
    status: reqString,
    userId: reqString,
});

export default mongoose.model('Suggestion', SuggestSchema);
