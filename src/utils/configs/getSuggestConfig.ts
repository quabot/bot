import type { Client } from 'discord.js';
import { cache } from '../../main';
import Suggest from '../../structures/schemas/SuggestConfigSchema';

export const getSuggestConfig = async (_client: Client, guildId: string) => {
    const suggestConfig =
        cache.get(`${guildId}-suggestion-config`) ??
        (await Suggest.findOne(
            {
                guildId,
            },
            (err: any, suggest: any) => {
                if (err) console.log(err);
                if (!suggest)
                    new Suggest({
                        guildId,
                        enabled: false,
                        channelId: 'none',
                        logEnabled: false,
                        logChannelId: 'none',
                        message: {
                            content: '',
                            title: 'New Suggestion!',
                            color: '',
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
                        emojiRed: '🔴',
                        emojiGreen: '🟢',
                        reasonRequired: true,
                        dm: true,
                        dmMessage: {
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
                        colors: { approve: '#40ff3d', deny: '#ff3d3d', pending: '#3a5a74' },
                    }).save();
            }
        )
            .clone()
            .catch(() => {}));

    cache.set(`${guildId}-suggestion-config`, suggestConfig);
    return suggestConfig;
};
