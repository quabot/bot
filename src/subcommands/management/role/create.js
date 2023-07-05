const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'role',
    name: 'create',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const role_name = interaction.options.getString('name');
        const role_hoist = interaction.options.getBoolean('hoist') ?? false;
        const role_mentionable = interaction.options.getBoolean('mentionable') ?? false;

        await interaction.guild.roles.create({
            name: role_name,
            hoist: role_hoist,
            mentionable: role_mentionable,
            reason: `Role created by ${interaction.user.username}`
        }).then(async (d) => {
            await interaction.editReply({
                embeds: [
                    new Embed(role.color ?? color)
                        .setDescription(`Created the role ${d}.`)
                ]
            });
        }).catch(async (e) => {
            await interaction.editReply({
                embeds: [
                    new Embed(color)
                        .setDescription(`Failed to create the role. Error message: ${e.message}.`)
                ]
            });
        });
    }
};
