const discord = require('discord.js');
const colors = require('../../files/colors.json');
const moment = require('moment');
const config = require('../../files/settings.json');

const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "serverinfo",
    description: "Server information.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const guild = interaction.guild
            const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = interaction.guild.members.cache;
            const channels = interaction.guild.channels.cache;
            const emojis = interaction.guild.emojis.cache;
            const stickers = interaction.guild.stickers.cache;


            const embed = new discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} server info`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .addField(`Channels:`, `${channels.size}`, true)
                .addField(`Text Channels:`, `${channels.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
                .addField(`Voice channels:`, `${channels.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
                .addField(`Boosts:`, `${interaction.guild.premiumSubscriptionCount || '0'}`, true)
                .addField(`Emojis & Stickers:`, `\`${emojis.size}\`/\`${stickers.size}\``, true)
                .addField(`Owner:`, `<@${guild.ownerId}>`, true)
                .addField(`Members:`, `${members.size}`, true)
                .setColor(colors.COLOR)
                .addField(`Locale:`, `${guild.preferredLocale}`, true)
                .addField(`Verification Level:`, `${guild.verificationLevel}`, true)
                .addField(`Time Created:`, `${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} [${moment(interaction.guild.createdTimestamp).fromNow()}]`, true)
            if (roles.join(', ').length > 1024) embed.addField("Roles", `The roles on this server are too long to put in an embed!`, true)
            if (roles.join(', ').length < 1024) embed.addField(`Roles [${roles.length - 1}]`, roles.join(', '))
            if (guild.description) embed.addField(`Description`, `${guild.description}`)

            interaction.reply({ embeds: [embed], split: true })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}