import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Embed from '../../_utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('members')
        .setDescription('Get the amount of people in the server.')
        .setDMPermission(false),
    async execute(_client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`${interaction.guild?.name}`)
                    .setDescription(`${interaction.guild?.memberCount}`),
            ],
        });
    },
};
