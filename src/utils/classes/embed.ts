import { type ColorResolvable, EmbedBuilder, type EmbedData, type APIEmbed } from 'discord.js';

export class Embed extends EmbedBuilder {
  constructor(color: ColorResolvable, data?: EmbedData | APIEmbed | undefined) {
    super(data);

		this.setColor(color);
		this.setFooter({
			text: 'quabot.net',
			iconURL: 'https://quabot.net/logo512.png',
		});
  }
}