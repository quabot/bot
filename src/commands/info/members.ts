import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription("Get the amount of people in the server.")
        .setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: string) {

        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`${interaction.guild?.name}`)
                    .setDescription(`${interaction.guild?.memberCount}`)
                    .setTimestamp()
            ]
        });
        

        // create embed from a general component
        // handle errors
        // make it execute
        // get colors to work
        // do subcommands
        // do buttons
        // do select menus
        // do modals
        // do context commands
    }
}