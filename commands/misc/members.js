const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "members",
    description: "When you use this command you will see the amount of members on a server.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const guild = interaction.guild
            const members = guild.memberCount;
            const membersEmbed = new discord.MessageEmbed()
                .setColor(colors.COLOR)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`${interaction.guild.name}`)
                .setDescription(`has **${members}** members!`)
            interaction.reply({ embeds: [membersEmbed] })
        } catch (e) {
            interaction.channel.send("{ embeds: [errorMain] }")
            console.log(e)
        }
    }
}