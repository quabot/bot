const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { Embed } = require("../../utils/constants/embed");

//* Create the command and pass the SlashCommandBuilder to the handler.
module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get an invite to add QuaBot to your own server.')
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
                .setTitle(`Add QuaBot`)
                .setDescription(
                    `Do you like QuaBot and do you want to try it out for yourself? Invite it [here](https://discord.com/oauth2/authorize?client_id=995243562134409296&permissions=274878426206&redirect_uri=https%3A%2F%2Fapi.quabot.net%2Fauth&response_type=code&scope=bot%20applications.commands%20guilds%20identify)! This link will also redirect your to our [dashboard](https://quabot.net).`
                ),
            ]
        })
    }
}