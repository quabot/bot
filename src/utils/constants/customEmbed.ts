import _ from 'lodash';
import { isValidHttpUrl } from '@functions/string';
import { Message } from '@typings/mongoose';
import { APIEmbedField, ColorResolvable, EmbedAuthorOptions, EmbedBuilder } from 'discord.js';

export class CustomEmbed extends EmbedBuilder {
  constructor(rawEmbed: Omit<Message, 'content'>, getParsedString: (str: string) => string) {
    super();

    if (rawEmbed.title) this.setTitle(`${getParsedString(rawEmbed.title)}`.substring(0, 256));

    if (rawEmbed.timestamp) this.setTimestamp();

    const text = getParsedString(rawEmbed.footer.text).substring(0, 2048);
    const iconURL = getParsedString(rawEmbed.footer.icon).substring(0, 2048);

    if (text) this.setFooter(isValidHttpUrl(iconURL) ? { text, iconURL } : { text });

    if (rawEmbed.author) {
      if (rawEmbed.author.text) {
        const author: EmbedAuthorOptions = { name: getParsedString(rawEmbed.author.text).substring(0, 256) };
        if (rawEmbed.author.url && isValidHttpUrl(getParsedString(rawEmbed.author.url).substring(0, 2048)))
          author.url = getParsedString(rawEmbed.author.url).substring(0, 2048);
        if (rawEmbed.author.icon && isValidHttpUrl(getParsedString(rawEmbed.author.icon).substring(0, 2048)))
          author.iconURL = getParsedString(rawEmbed.author.icon).substring(0, 2048);

        this.setAuthor(author);
      }
    }

    if (rawEmbed.description) this.setDescription(getParsedString(rawEmbed.description).substring(0, 4096));

    if (rawEmbed.url && isValidHttpUrl(getParsedString(rawEmbed.url).substring(0, 2048)))
      this.setURL(getParsedString(rawEmbed.url).substring(0, 2048));

    if (rawEmbed.thumbnail && isValidHttpUrl(getParsedString(rawEmbed.thumbnail).substring(0, 2048)))
      this.setThumbnail(getParsedString(rawEmbed.thumbnail).substring(0, 2048));

    if (rawEmbed.image && isValidHttpUrl(getParsedString(rawEmbed.image).substring(0, 2048)))
      this.setImage(getParsedString(rawEmbed.image).substring(0, 2048));

    if (rawEmbed.color) this.setColor((getParsedString(rawEmbed.color.toString()) as ColorResolvable) ?? '#416683');

    const newFields: APIEmbedField[] = [];
    rawEmbed.fields.forEach(field =>
      newFields.push({
        name: `${getParsedString(field.name)}`.substring(0, 256),
        value: `${getParsedString(field.value)}`.substring(0, 1024),
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
