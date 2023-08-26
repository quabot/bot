const { EmbedBuilder } = require('discord.js');
const _ = require('lodash');
const { isValidHttpUrl } = require('../functions/string');

class CustomEmbed extends EmbedBuilder {
	constructor(rawEmbed, getParsedString) {
		super();

		const embed = new EmbedBuilder();

		if (rawEmbed.title) embed.setTitle(`${getParsedString(rawEmbed.title)}`.substring(0, 256));

		if (rawEmbed.timestamp) embed.setTimestamp();

		if (rawEmbed.footer) {
			let text = null;
			let iconURL = null;
			if (rawEmbed.footer.text) text = getParsedString(rawEmbed.footer.text).substring(0, 2048);
			if (rawEmbed.footer.icon && isValidHttpUrl(getParsedString(rawEmbed.footer.icon).substring(0, 2048))) iconURL = getParsedString(rawEmbed.footer.icon).substring(0, 2048);
			embed.setFooter({ text, iconURL });
		}

		if (rawEmbed.author) {
			let name = null;
			let url = null;
			let iconURL = null;
			if (rawEmbed.author.text) name = getParsedString(rawEmbed.author.text).substring(0, 256);
			if (rawEmbed.author.url && isValidHttpUrl(getParsedString(rawEmbed.author.url).substring(0, 2048))) url = getParsedString(rawEmbed.author.url).substring(0, 2048);
			if (rawEmbed.author.icon && isValidHttpUrl(getParsedString(rawEmbed.author.icon).substring(0, 2048))) iconURL = getParsedString(rawEmbed.author.icon).substring(0, 2048);
			embed.setAuthor({ name, iconURL, url });
		}

		if (rawEmbed.description) embed.setDescription(getParsedString(rawEmbed.description).substring(0, 4096));

		if (rawEmbed.url && isValidHttpUrl(getParsedString(rawEmbed.url).substring(0, 2048))) embed.setURL(getParsedString(rawEmbed.url).substring(0, 2048));

		if (rawEmbed.thumbnail && isValidHttpUrl(getParsedString(rawEmbed.thumbnail).substring(0, 2048))) embed.setThumbnail(getParsedString(rawEmbed.thumbnail).substring(0, 2048));

		if (rawEmbed.image && isValidHttpUrl(getParsedString(rawEmbed.image).substring(0, 2048))) embed.setImage(getParsedString(rawEmbed.image).substring(0, 2048));

		if (rawEmbed.color) embed.setColor(getParsedString(rawEmbed.color) ?? '#416683');

		const newFields = [];
		rawEmbed.fields.forEach((field) => newFields.push({ name: `${getParsedString(field.name)}`.substring(0, 256), value: `${getParsedString(field.value)}`.substring(0, 1024), inline: field.inline }));
        
		if (newFields.length !== 0) embed.addFields(newFields);
        
		if (!embed.data.title && !embed.data.footer.text && !embed.data.footer.icon_url && !embed.data.author.name && !embed.data.description && !embed.data.fields && !embed.data.image && !embed.data.thumbnail && !embed.data.timestamp && !embed.data.title) return new EmbedBuilder().setDescription('** **');
        
        
		// if (embed.length >= 6000) return new EmbedBuilder().setDescription('Your custom embed length is too long, please remove text to make it send properly next time.');
		return embed;
	}
}


module.exports = { CustomEmbed };