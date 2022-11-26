import mongoose from 'mongoose';
import { reqBool, reqObject, reqString } from '../../utils/constants/schemas';

const SuggestConfigSchema = new mongoose.Schema({
    guildId: reqString,

    enabled: reqBool,
    channelId: reqString,

    logEnabled: reqBool,
    logChannelId: reqString,

    message: reqObject,
    emojiRed: reqString,
    emojiGreen: reqString,

    reasonRequired: reqBool,
    dm: reqBool,
    dmMessage: reqObject,

    colors: reqObject
});

module.exports = mongoose.model('Suggestion-Config', SuggestConfigSchema);