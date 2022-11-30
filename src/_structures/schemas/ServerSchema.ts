import mongoose from 'mongoose';
import { reqString } from '../../_utils/constants/schemas';

const ServerSchema = new mongoose.Schema({
    guildId: reqString,
    locale: reqString,
    color: reqString,
    updatesChannel: reqString,
});

export default mongoose.model('Server', ServerSchema);
