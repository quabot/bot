const { MessageEmbed } = require('discord.js');

const { error, added } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "online",
    description: "Get a list of user presences.",
    async execute(client, interaction) {
        try {
            const members = interaction.guild.members.cache;
            const totalMembers = interaction.guild.memberCount;
            const online = members.filter(user => user.presence?.status === 'online').size;
            const idle = members.filter(user => user.presence?.status === 'idle').size;
            const dnd = members.filter(user => user.presence?.status === 'dnd').size;
            const totalOffline = totalMembers - idle - dnd - online;

            const embed = new MessageEmbed()
                .setColor(COLOR_MAIN)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`${interaction.guild.name}`)
                .addField("<:online:938818583868366858> Online:", `${online}`, true)
                .addField("<:idle:938818583864180796> Idle:", `${idle}`, true)
                .addField("<:dnd:938818583939649556> Do Not Disturb:", `${dnd}`, true)
                .addField("<:invisible:938818583864147988> Offline:", `${totalOffline}`, true)
                .setFooter(`Total Members: ${totalMembers}`)
            interaction.reply({ embeds: [embed] }).catch(err => console.log("Error!"));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log("Error!"));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: cat`)] }).catch(err => console.log("Error!"));;
            return;
        }
    }
}