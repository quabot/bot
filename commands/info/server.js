const discord = require('discord.js');
const colors = require('../../files/colors.json');
const moment = require('moment');
const config = require('../../files/config.json');

module.exports = {
    name: "serverinfo",
    description: "When you use this command, you can see a list of information about the server.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        const guild = interaction.guild
        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const members = interaction.guild.members.cache;
        const channels = interaction.guild.channels.cache;
        const emojis = interaction.guild.emojis.cache;
        const stickers = interaction.guild.stickers.cache;

        console.log(guild)


        const embed = new discord.MessageEmbed()
            .setTitle(`${interaction.guild.name} server info`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .addField(`Members:`, `${members.size}`, true)
            .addField(`Channels`, `${channels.size}`, true)
            .addField(`Text Channels`, `${channels.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
            .addField(`Voice channels`, `${channels.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
            .addField(`Boosts`, `${interaction.guild.premiumSubscriptionCount || '0'}`, true)
            .addField(`Emojis:`, `${emojis.size}`, true)
            .addField(`Stickers:`, `${stickers.size}`, true)
            .addField(`Owner`, `<@${guild.ownerId}>`, true)
            .addField(`Roles`, `${roles.length}`, true)
            .addField(`Time Created:`, `${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} [${moment(interaction.guild.createdTimestamp).fromNow()}]`, true)
            .addField(`Verification Level`, `${guild.verificationLevel}`, true)
            .addField(`Preferred Locale`, `${guild.preferredLocale}`, true)
            .addField(`Description`, `${guild.description}`)
            .setColor(colors.COLOR)

        interaction.reply({ embeds: [embed], split: true })
    }
}