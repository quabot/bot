const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Get the amount of members in the server.')
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${client.user.avatarURL()}`)
                    .setTitle(`${interaction.guild.name}`)
                    .setDescription(`${interaction.guild.memberCount.toLocaleString()} members.`),
            ]
        })
    }
}