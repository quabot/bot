const discord = require('discord.js');

const colors = require('../../files/colors.json');
const { errorMain } = require('../../files/embeds');

module.exports = {
    name: "online",
    description: "This will display the amount of users on the guild with every presence.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const members = interaction.guild.members.cache;
        const totalMembers = interaction.guild.memberCount;
        const online = members.filter(user => user.presence?.status === 'online').size;
        const idle = members.filter(user => user.presence?.status === 'idle').size;
        const dnd = members.filter(user => user.presence?.status === 'dnd').size;
        const totalOffline = totalMembers - idle - dnd - online;

        const embed = new discord.MessageEmbed()
            .setColor(colors.COLOR)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTitle(`${interaction.guild.name}`)
            .addField("Online:", `${online}`, true)
            .addField("Idle:", `${idle}`, true)
            .addField("Do Not Disturb:", `${dnd}`, true)
            .addField("Offline:", `${totalOffline}`, true)
            .setFooter(`Total Members: ${totalMembers}`)
        interaction.reply({ embeds: [embed]});
        } catch (e) {
            interaction.channel.send({ embeds: [errorMain]})
            console.log(e)
        }
    }
}