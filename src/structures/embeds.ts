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

        const author = {
            name: getParsedString(rawEmbed.author.name),
            url: getParsedString(rawEmbed.author.url),
            iconURL: getParsedString(rawEmbed.author.iconURL),
        };

        const footer = {
            text: getParsedString(rawEmbed.footer.text),
            iconURL: getParsedString(rawEmbed.footer.iconURL),
        };

        this.setTitle(getParsedString(rawEmbed.title))
            .setURL(getParsedString(rawEmbed.url))
            .setDescription(getParsedString(rawEmbed.description))

            .setThumbnail(getParsedString(rawEmbed.thumbnail))
            .setImage(getParsedString(rawEmbed.image))

            .setColor(getParsedString(rawEmbed.color))

            .setAuthor(author.name ? author : null)
            .setFooter(footer.text ? footer : null);

        if (rawEmbed.fields) this.setFields(rawEmbed.fields);

        if (rawEmbed.timestamp === 'true') this.setTimestamp();
    }
}
