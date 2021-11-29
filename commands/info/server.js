const discord = require('discord.js');
const colors = require('../../files/colors.json');
const moment = require('moment');
const config = require('../../files/config.json');

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
                .addField("General Info", "** **")
                .addField(`Channels:`, `${channels.size}`, true)
                .addField(`Text Channels:`, `${channels.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
                .addField(`Voice channels:`, `${channels.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
                .addField("Statistics", "** **")
                .addField(`Boosts:`, `${interaction.guild.premiumSubscriptionCount || '0'}`, true)
                .addField(`Emojis & Stickers:`, `\`${emojis.size}\`/\`${stickers.size}\``, true)
                .addField(`Roles:`, `${roles.length}`, true)
                .addField("Guild Info", "** **")
                .addField(`Owner:`, `<@${guild.ownerId}>`, true)
                .addField(`Description:`, `${guild.description}`, true)
                .addField(`Members:`, `${members.size}`, true)  	
                .addField(`Locale:`, `${guild.preferredLocale}`, true)
                .addField(`Verification Level:`, `${guild.verificationLevel}`, true)
                .addField(`Time Created:`, `${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} [${moment(interaction.guild.createdTimestamp).fromNow()}]`, true)
                .setColor(colors.COLOR)
    
            interaction.reply({ embeds: [embed], split: true })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}