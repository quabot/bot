import { type ColorResolvable, EmbedBuilder } from 'discord.js';

export class Embed extends EmbedBuilder {
  constructor(color: ColorResolvable) {
    super();

    return new EmbedBuilder().setTimestamp().setColor(color).setFooter({
      text: 'quabot.net',
      iconURL: 'https://i.imgur.com/5ONDYp3.png',
    });
  }
}

module.exports = { Embed };
