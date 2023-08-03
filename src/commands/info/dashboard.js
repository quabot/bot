const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Get the URL to our dashboard.')
        .setDMPermission(false),
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    async execute(client, interaction, color) {
        //* Defer the reply to give the user an instant response.
        await interaction.deferReply();

        //* Send the response to the user.
        await interaction.editReply({
            embeds: [
                new Embed(color)
                .setThumbnail(`${client.user.avatarURL()}`)
                .setTitle(`QuaBot Dashboard`)
                .setDescription(`You can find our dashboard [here](https://quabot.net)!`),
            ]
        });
    }
}