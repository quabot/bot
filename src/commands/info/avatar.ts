import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get an avatar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Get the avatar of a user.')
                .addUserOption(option =>
                    option.setName('user').setDescription("The user you'd like to see the avatar from!")
                )
        )
        .addSubcommand(subcommand => subcommand.setName('server').setDescription('Get the avatar of the server.'))
        .setDMPermission(false),
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: any) {
        await interaction.deferReply();

        const user = interaction.options.getUser('user') ?? interaction.user;

        await interaction.editReply({
            embeds: [
                embed(color)
                    .setImage(user.displayAvatarURL({ size: 1024, forceStatic: false }))
                    .setTitle(`${user.tag}'s avatar`),
            ],
        });
    },
};
