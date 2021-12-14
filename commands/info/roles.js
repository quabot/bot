const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "roles",
    description: "List of roles in this guild.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {
        try {
            const guild = interaction.guild
            const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const embed = new Discord.MessageEmbed()
                .setTitle(`${interaction.guild.name} roles`)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor(colors.COLOR)
            if (roles.join(', ').length > 1024) embed.setDescription(`The roles on this server are too long to put in an embed!`)
            if (roles.join(', ').length < 1024) embed.addField(`Roles [${roles.length - 1}]`, roles.join(', '))
                
            interaction.reply({ embeds: [embed], split: true })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}