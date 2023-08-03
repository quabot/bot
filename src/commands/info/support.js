const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get the invite to the QuaBot support server.')
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
                    .setTitle(`QuaBot Support`)
                    .setDescription(
                        `Join our support server [here](https://discord.gg/kxKHuy47Eq) for fun, events, questions and suggestions!`
                    ),
            ]
        })
    }
}