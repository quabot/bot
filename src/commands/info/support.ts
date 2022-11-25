import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embed } from "../../utils/constants/embeds";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription("Get an invite to our support server.")
        .setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: any) {

        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                embed(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`QuaBot Support`)
                    .setDescription(`Join our support server [here](https://discord.gg/kxKHuy47Eq) for fun, events, questions and suggestions!`)
            ]
        });
    }
}