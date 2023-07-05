const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'avatar',
    name: 'user',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const user = interaction.options.getUser('user') ?? interaction.user;

        await interaction.editReply({
            embeds: [
                new Embed(color)
                    .setImage(
                        user.avatarURL({ size: 1024, forceStatic: false }) ??
                        'https://www.datanumen.com/blogs/wp-content/uploads/2016/07/The-file-does-not-exist.png'
                    )
                    .setTitle(`${user.username}'s avatar`),
            ],
        });
    },
};
