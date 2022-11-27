import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Get the link of our dashboard.')
        .setDMPermission(false),
    async execute(client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                embed(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`QuaBot Dashboard`)
                    .setDescription(`You can find our dashboard [here](https://quabot.net)!`),
            ],
        });
    },
};
