import _ from 'lodash';
import { isValidHttpUrl } from '@functions/string';
import { Message } from '@typings/mongoose';
import { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedBuilder } from 'discord.js';
import type { BaseParser } from '@classes/parsers';

export class CustomEmbed extends EmbedBuilder {
  constructor(rawEmbed: Omit<Message, 'content'>, parser: BaseParser) {
    super();

    if (rawEmbed.title) this.setTitle(`${parser.parse(rawEmbed.title)}`.substring(0, 256));

    if (rawEmbed.timestamp) this.setTimestamp();

    const text = parser.parse(rawEmbed.footer.text).substring(0, 2048);
    const iconURL = parser.parse(rawEmbed.footer.icon).substring(0, 2048);

    if (text) this.setFooter(isValidHttpUrl(iconURL) ? { text, iconURL } : { text });

    if (rawEmbed.author) {
      if (rawEmbed.author.text) {
        const author: EmbedAuthorOptions = { name: parser.parse(rawEmbed.author.text).substring(0, 256) };
        if (rawEmbed.author.url && isValidHttpUrl(parser.parse(rawEmbed.author.url).substring(0, 2048)))
          author.url = parser.parse(rawEmbed.author.url).substring(0, 2048);
        if (rawEmbed.author.icon && isValidHttpUrl(parser.parse(rawEmbed.author.icon).substring(0, 2048)))
          author.iconURL = parser.parse(rawEmbed.author.icon).substring(0, 2048);

        this.setAuthor(author);
      }
    }

    if (rawEmbed.description) this.setDescription(parser.parse(rawEmbed.description).substring(0, 4096));

    if (rawEmbed.url && isValidHttpUrl(parser.parse(rawEmbed.url).substring(0, 2048)))
      this.setURL(parser.parse(rawEmbed.url).substring(0, 2048));

    if (rawEmbed.thumbnail && isValidHttpUrl(parser.parse(rawEmbed.thumbnail).substring(0, 2048)))
      this.setThumbnail(parser.parse(rawEmbed.thumbnail).substring(0, 2048));

    if (rawEmbed.image && isValidHttpUrl(parser.parse(rawEmbed.image).substring(0, 2048)))
      this.setImage(parser.parse(rawEmbed.image).substring(0, 2048));

    if (rawEmbed.color) this.setColor((parser.parse(rawEmbed.color.toString()) as ColorResolvable) ?? '#416683');

    const newFields: APIEmbedField[] = [];
    rawEmbed.fields.forEach(field =>
      newFields.push({
        name: `${parser.parse(field.name)}`.substring(0, 256),
        value: `${parser.parse(field.value)}`.substring(0, 1024),
        inline: field.inline,
      }),
    );

    if (newFields.length !== 0) this.addFields(newFields);

    if (
      !this.data.title &&
      !this.data.footer?.text &&
      !this.data.footer?.icon_url &&
      !this.data.author?.name &&
      !this.data.description &&
      !this.data.fields &&
      !this.data.image &&
      !this.data.thumbnail &&
      !this.data.timestamp &&
      !this.data.title
    )
      return new EmbedBuilder().setDescription('** **');

    return this;
  }
}
