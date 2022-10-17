const { Interaction, EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Get the amount of people in the server.')
        .setDMPermission(false),
    /**
     * @param {Interaction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply().catch(e => {});

        interaction
            .editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(color)
                        .setTitle(`${interaction.guild.name} Members`)
                        .setDescription(`${interaction.guild.memberCount}`)
                        .setTimestamp(),
                ],
            })
            .catch(e => {});
    },
};
