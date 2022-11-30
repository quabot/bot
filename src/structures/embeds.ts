import { type ColorResolvable, EmbedBuilder } from 'discord.js';

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
