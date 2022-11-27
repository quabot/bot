import mongoose from 'mongoose';
import { optId, reqString } from '../../utils/constants/schemas';

const IdsSchema = new mongoose.Schema({
    guildId: reqString,
    suggestId: optId,
});

export default mongoose.model('Id', IdsSchema);
