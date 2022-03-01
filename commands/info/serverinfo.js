const { MessageEmbed } = require('discord.js');
const moment = require('moment');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "serverinfo",
    description: "Server information.",
    async execute(client, interaction) {

        try {
            const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = interaction.guild.members.cache;
            const channels = interaction.guild.channels.cache;
            const emojis = interaction.guild.emojis.cache;
            const stickers = interaction.guild.stickers.cache;

            const embed = new MessageEmbed()
                .setTitle(`${interaction.guild.name} server info`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .addField(`Channels:`, `${channels.size}`, true)
                .addField(`Text Channels:`, `${channels.filter(channel => channel.type === "GUILD_TEXT").size}`, true)
                .addField(`Voice channels:`, `${channels.filter(channel => channel.type === "GUILD_VOICE").size}`, true)
                .addField(`Boosts:`, `${interaction.guild.premiumSubscriptionCount || '0'}`, true)
                .addField(`Emojis & Stickers:`, `\`${emojis.size}\`/\`${stickers.size}\``, true)
                .addField(`Owner:`, `<@${interaction.guild.ownerId}>`, true)
                .addField(`Members:`, `${members.size}`, true)
                .setColor(COLOR_MAIN)
                .addField(`Locale:`, `${interaction.guild.preferredLocale}`, true)
                .addField(`Verification Level:`, `${interaction.guild.verificationLevel}`, true)
                .addField(`Time Created:`, `${moment(interaction.guild.createdTimestamp).format('LT')} ${moment(interaction.guild.createdTimestamp).format('LL')} [${moment(interaction.guild.createdTimestamp).fromNow()}]`, true);
            if (interaction.guild.description) embed.addField(`Description`, `${interaction.guild.description}`);
            if (roles.join(', ').length > 1024) embed.addField("Roles", `Please use \`/roles\` to get the full list of roles.`, true);
            if (roles.join(', ').length < 1024) embed.addField(`Roles [${roles.length - 1}]`, roles.join(', '));

            interaction.reply({ embeds: [embed], split: true }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: serverinfo`)] }).catch(err => console.log(err));;
            return;
        }
    }
}