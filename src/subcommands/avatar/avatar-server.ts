import type { ChatInputCommandInteraction, Client, ColorResolvable, Guild } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
    parent: 'avatar',
    name: 'server',
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: ColorResolvable) {
        await interaction.deferReply();
        const guild = interaction.guild as Guild;

        await interaction.editReply({
            embeds: [
                embed(color)
                    .setImage(
                        guild.iconURL({ size: 1024, forceStatic: false }) ??
                            'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png'
                    )
                    .setTitle(`${guild.name}'s avatar`),
            ],
        });
    },
};
