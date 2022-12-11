import { Client, schemas } from '../structures';

export const reqString = {
    type: String,
    required: true,
};

export const reqNum = {
    type: Number,
    required: true,
};

export const reqBool = {
    type: Boolean,
    required: true,
};

export const reqObject = {
    type: Object,
    required: true,
};

export const optBoolDefFalse = {
    type: Boolean,
    default: false,
    required: false,
};

export const optBoolDefTrue = {
    type: Boolean,
    default: true,
    required: false,
};

export const optLocale = {
    type: String,
    default: 'en-us',
    required: false,
};

export const optColor = {
    type: String,
    default: '#3a5a74',
    required: false,
};

export const optChannel = {
    type: String,
    default: 'none',
    required: false,
};

export const optRedEmoji = {
    type: String,
    default: '🔴',
    required: false,
};

export const optGreenEmoji = {
    type: String,
    default: '🟢',
    required: false,
};

export const optId = {
    type: Number,
    default: 0,
    required: false,
};

export const optSuggestColors = {
    type: Object,
    default: { approve: '#40ff3d', deny: '#ff3d3d', pending: '#8f8d8d' },
    required: false,
};

export const optSuggestMessage = {
    type: Object,
    default: {
        content: '',
        title: 'New Suggestion!',
        color: '#8f8d8d',
        timestamp: true,
        footer: {
            text: 'Vote with the 🟢 and 🔴 below this message.',
            icon: '',
        },
        author: {
            text: '',
            icon: '',
            url: '',
        },
        description: '',
        fields: [
            { name: 'Suggestion', value: '{suggestion}', inline: false },
            { name: 'Suggested By', value: '{user}', inline: false },
        ],
        url: '',
        thumbnail: '',
        image: '',
    },
    required: false,
};

export const optSuggestDmMessage = {
    type: Object,
    default: {
        content: '',
        title: 'Your suggestion was {state}!',
        color: '',
        timestamp: true,
        footer: {
            text: '',
            icon: '',
        },
        author: {
            text: '',
            icon: '',
            url: '',
        },
        description: 'Hello {user}! Your suggestion in {server} was {state} by {staff}!',
        fields: [],
        url: '',
        thumbnail: '',
        image: '',
    },
    required: false,
};

export async function getIdConfig(client: Client, guildId: string) {
    return await getFromDB(client, guildId, schemas.Ids, 'id-config');
}

export async function getServerConfig(client: Client, guildId: string) {
    return await getFromDB(client, guildId, schemas.Server, `${guildId}-server-config`);
}

export async function getSuggestConfig(client: Client, guildId: string) {
    return await getFromDB(client, guildId, schemas.SuggestConfig, `${guildId}-suggestion-config`);
}

async function getFromDB(client: Client, guildId: string, Schema: any, cacheName: string) {
    let result = client.cache.get(cacheName);
    if (!result) {
        result = Schema.findOne({ guildId }, (err: any, data: any) => {
            if (err) console.log(err);
            if (!data) new Schema({ guildId }).save();
        })
            .clone()
            .catch(() => {});

        client.cache.set(cacheName, result);
    }

    return result;
}
