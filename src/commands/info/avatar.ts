import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import Embed from '../../utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription("View a user's avatar.")
        .addUserOption(option => option.setName('user').setDescription("The user you'd like to see the avatar from!"))
        .setDMPermission(false),
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: any) {
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
