const { MessageEmbed } = require('discord.js');

const { error } = require('../../embeds/general');
const { COLOR_MAIN } = require('../../files/colors.json');

module.exports = {
    name: "members",
    description: "Amount of members.",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction) {

        try {
            const guild = interaction.guild
            const members = guild.memberCount;
            const membersEmbed = new MessageEmbed().setColor(COLOR_MAIN).setThumbnail(interaction.guild.iconURL({ dynamic: true })).setTitle(`${interaction.guild.name}`).setDescription(`has **${members}** members!`)
            interaction.reply({ embeds: [membersEmbed] }).catch(err => console.log(err));
        } catch (e) {
            interaction.channel.send({ embeds: [error] }).catch(err => console.log(err));
            client.guilds.cache.get('847828281860423690').channels.cache.get('938509157710061608').send({ embeds: [new MessageEmbed().setTitle(`Error!`).setDescription(`${e}`).setColor(`RED`).setFooter(`Command: bio`)] }).catch(err => console.log(err));
            return;
        }
    }
}