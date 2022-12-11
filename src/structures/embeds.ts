import {
    type ColorResolvable,
    type APIEmbed,
    type EmbedAuthorOptions,
    type EmbedFooterOptions,
    EmbedBuilder,
} from 'discord.js';

export class Embed extends EmbedBuilder {
    constructor(color: ColorResolvable) {
        super();

        this.setColor(color)
            .setFooter({
                text: 'quabot.net',
                iconURL: 'https://cdn.discordapp.com/icons/1007810461347086357/a08a18c53574cadc45aa5825e1decd9c.webp',
            })
            .setTimestamp();
    }
}

export interface CustomEmbedJSON extends APIEmbed {
    content: string | undefined;

    author: EmbedAuthorOptions;
    footer: EmbedFooterOptions;

    timestamp: 'true' | 'false';
}

export class CustomEmbed extends EmbedBuilder {
    constructor(rawEmbed: CustomEmbedJSON, getParsedString: Function) {
        super();

        this.setTitle(getParsedString(rawEmbed.title) ?? null)
            .setURL(getParsedString(rawEmbed.url) ?? null)
            .setDescription(getParsedString(rawEmbed.description) ?? null)

            .setThumbnail(getParsedString(rawEmbed.thumbnail) ?? null)
            .setImage(getParsedString(rawEmbed.image) ?? null)

            .setColor(getParsedString(rawEmbed.color) ?? null)

            .setAuthor(rawEmbed.author ?? null)
            .setFooter(rawEmbed.footer ?? null);

        if (rawEmbed.fields) this.setFields(rawEmbed.fields);

        if (rawEmbed.timestamp === 'true') this.setTimestamp();
    }
}
