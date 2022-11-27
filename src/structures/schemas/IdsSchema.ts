import mongoose from 'mongoose';
import { optId, reqString } from '../../utils/constants/schemas';

const IdsSchema = new mongoose.Schema({
    guildId: reqString,
    suggestId: optId,
});

module.exports = mongoose.model('Id', IdsSchema);
