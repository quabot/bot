const { EmbedBuilder } = require("discord.js");

class CustomEmbed extends EmbedBuilder {
    constructor(rawEmbed, getParsedString) {
        super();

        const embed = new EmbedBuilder();

        if (rawEmbed.title) embed.setTitle(`${getParsedString(rawEmbed.title)}`);

        if (rawEmbed.timestamp) embed.setTimestamp();

        if (rawEmbed.footer) {
            let text = null;
            let iconURL = null;
            if (rawEmbed.footer.text) text = getParsedString(rawEmbed.footer.text);
            if (rawEmbed.footer.icon) iconURL = getParsedString(rawEmbed.footer.icon);
            embed.setFooter({ text, iconURL });
        }

        if (rawEmbed.author) {
            let name = null;
            let url = null;
            let iconURL = null;
            if (rawEmbed.author.text) name = getParsedString(rawEmbed.author.text);
            if (rawEmbed.author.url) url = getParsedString(rawEmbed.author.url);
            if (rawEmbed.author.icon) iconURL = getParsedString(rawEmbed.author.icon);
            embed.setAuthor({ name, iconURL, url });
        }

        if (rawEmbed.description) embed.setDescription(getParsedString(rawEmbed.description));

        if (rawEmbed.url) embed.setURL(getParsedString(rawEmbed.url));

        if (rawEmbed.thumbnail) embed.setThumbnail(getParsedString(rawEmbed.thumbnail));

        if (rawEmbed.image) embed.setImage(getParsedString(rawEmbed.image));
        
        if (rawEmbed.color) embed.setColor(getParsedString(rawEmbed.color));

        const newFields = [];
        rawEmbed.fields.forEach((field) => newFields.push({ name: `${getParsedString(field.name)}`, value: `${getParsedString(field.value)}`, inline: field.inline }));
        
        if (newFields.length !== 0) embed.addFields(newFields);

        return embed;
    }
}


module.exports = { CustomEmbed }