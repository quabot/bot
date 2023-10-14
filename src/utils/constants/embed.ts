import { type ColorResolvable, EmbedBuilder, type EmbedData, type APIEmbed } from 'discord.js';

export class Embed extends EmbedBuilder {
  constructor(color: ColorResolvable, data?: EmbedData | APIEmbed | undefined) {
    super(data);

    return new EmbedBuilder().setTimestamp().setColor(color).setFooter({
      text: 'quabot.net',
      iconURL: 'https://i.imgur.com/5ONDYp3.png',
    });
  }
}
