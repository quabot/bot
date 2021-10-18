const discord = require('discord.js');
const colors = require('../../files/colors.json');

module.exports = {
    name: "servericon",
    description: "When you use this command you will see the servers icon.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        const guild = interaction.guild
        const members = guild.memberCount;
        const membersEmbed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTitle(`${interaction.guild.name}`)
            .setFooter("If you don't see an icon, the guild doesn't have one.")
            interaction.reply({ embeds: [membersEmbed] })

    }
}