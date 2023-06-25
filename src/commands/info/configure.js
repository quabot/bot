const { SlashCommandBuilder, Client, ChatInputCommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configure')
        .setDescription('Configure QuaBot\'s settings.')
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setDescription(`In order to configure QuaBot's settings, visit the [QuaBot Dashboard](https://quabot.net/dashboard/${interaction.guildId})/general.`)
            ]
        });
    }
}