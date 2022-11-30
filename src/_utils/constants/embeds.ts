import { type ColorResolvable, EmbedBuilder } from 'discord.js';

class Embed extends EmbedBuilder {
    constructor(color: ColorResolvable) {
        super();
        
        return new EmbedBuilder().setTimestamp().setColor(color).setFooter({
            text: 'quabot.net',
            iconURL: 'https://cdn.discordapp.com/icons/1007810461347086357/a08a18c53574cadc45aa5825e1decd9c.webp',
        });
    }
}

export default Embed;
