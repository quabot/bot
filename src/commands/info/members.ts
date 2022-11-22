import { Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription("Get the amount of people in the server.")
        .setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: any) {

        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`${interaction.guild?.name}`)
                    .setDescription(`${interaction.guild?.memberCount}`)
                    .setTimestamp()
            ]
        });
        

        // create embed from a general component
        // handle errors
        // get colors to work
        // do subcommands
        // do buttons
        // do select menus
        // do modals
        // do context commands
    }
}