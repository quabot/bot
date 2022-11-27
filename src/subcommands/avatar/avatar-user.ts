import type { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import Embed from '../../utils/constants/embeds';

module.exports = {
    parent: 'avatar',
    name: 'user',
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: ColorResolvable) {
        await interaction.deferReply();

        const user = interaction.options.getUser('user') ?? interaction.user;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setImage(user.displayAvatarURL({ size: 1024, forceStatic: false }))
                    .setTitle(`${user.tag}'s avatar`),
            ],
        });
    },
};
