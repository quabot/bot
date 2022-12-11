import mongoose from 'mongoose';
import {
    reqString,
    reqNum,
    optId,
    optLocale,
    optColor,
    optChannel,
    optBoolDefFalse,
    optSuggestMessage,
    optRedEmoji,
    optGreenEmoji,
    optBoolDefTrue,
    optSuggestDmMessage,
    optSuggestColors,
} from '../utils';

const Ids = mongoose.model(
    'Id',
    new mongoose.Schema({
        guildId: reqString,
        suggestId: optId,
    })
);

const Server = mongoose.model(
    'Server',
    new mongoose.Schema({
        guildId: reqString,
        locale: optLocale,
        color: optColor,
        updatesChannel: optChannel,
    })
);

const SuggestConfig = mongoose.model(
    'Suggestion-Config',
    new mongoose.Schema({
        guildId: reqString,

        enabled: optBoolDefFalse,
        channelId: optChannel,

        logEnabled: optBoolDefFalse,
        logChannelId: optChannel,

        message: optSuggestMessage,
        emojiRed: optRedEmoji,
        emojiGreen: optGreenEmoji,

        reasonRequired: optBoolDefTrue,
        dm: optBoolDefTrue,
        dmMessage: optSuggestDmMessage,

        colors: optSuggestColors,
    })
);

const Suggest = mongoose.model(
    'Suggestion',
    new mongoose.Schema({
        guildId: reqString,
        id: reqNum,
        msgId: reqString,
        suggestion: reqString,
        status: reqString,
        userId: reqString,
    })
);

export const Schemas = {
    Ids,
    Server,
    SuggestConfig,
    Suggest,
};
