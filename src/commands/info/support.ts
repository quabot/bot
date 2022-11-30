import { Client, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import Embed from '../../_utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Get an invite to our support server.')
        .setDMPermission(false),
    async execute(_client: Client, interaction: CommandInteraction, color: any) {
        await interaction.deferReply();

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setThumbnail(`${interaction.guild?.iconURL()}`)
                    .setTitle(`QuaBot Support`)
                    .setDescription(
                        `Join our support server [here](https://discord.gg/kxKHuy47Eq) for fun, events, questions and suggestions!`
                    ),
            ],
        });
    },
};
