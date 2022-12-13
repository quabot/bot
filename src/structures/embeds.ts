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

export interface CustomEmbedJSON extends Omit<APIEmbed, 'timestamp'> {
    content: string;

    author: EmbedAuthorOptions;
    footer: EmbedFooterOptions;

    timestamp: boolean;
}

export class CustomEmbed extends EmbedBuilder {
    constructor(rawEmbed: CustomEmbedJSON, getParsedString: (str: string | undefined) => string | null) {
        super();

        const author: EmbedAuthorOptions = {
            name: getParsedString(rawEmbed.author.name) as string,
        };

        if (notEmptyStringChecker(rawEmbed.author.url)) author.url = getParsedString(rawEmbed.author.url) as string;
        if (notEmptyStringChecker(rawEmbed.author.iconURL))
            author.iconURL = getParsedString(rawEmbed.author.iconURL) as string;

        const footer: EmbedFooterOptions = {
            text: getParsedString(rawEmbed.footer.text) as string,
        };

        if (notEmptyStringChecker(rawEmbed.footer.iconURL))
            footer.iconURL = getParsedString(rawEmbed.footer.iconURL) as string;

        this.setTitle(getParsedString(rawEmbed.title))
            .setURL(getParsedString(rawEmbed.url))
            .setDescription(getParsedString(rawEmbed.description))

            .setThumbnail(getParsedString(rawEmbed.thumbnail as string | undefined))
            .setImage(getParsedString(rawEmbed.image as string | undefined))

            .setColor(getParsedString(rawEmbed.color as string | undefined) as ColorResolvable | null)

            .setAuthor(author.name ? author : null)
            .setFooter(footer.text ? footer : null);

        if (rawEmbed.fields)
            this.setFields(
                rawEmbed.fields.map(field => ({
                    name: getParsedString(field.name) as string,
                    value: getParsedString(field.value) as string,
                    inline: field.inline as boolean,
                }))
            );

        if (rawEmbed.timestamp) this.setTimestamp();

        function notEmptyStringChecker(str: string | undefined) {
            if (str?.length) return str?.length > 0;

            return false;
        }
    }
}
