const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "servericon",
    description: "Server's icon.",
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
                .setImage(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`${interaction.guild.name}`)
                .setTimestamp()
                .setFooter("If you don't see an icon, the guild doesn't have one.")
            interaction.reply({ embeds: [membersEmbed] })
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain] })
            console.log(e)
        }
    }
}