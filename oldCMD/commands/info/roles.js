const Discord = require('discord.js');
const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "roles",
    description: "When using this command you will recieve a list of roles in this guild.",
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
                .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
                .setColor(colors.COLOR)
            interaction.reply({ embeds: [embed] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}