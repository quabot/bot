const { ChatInputCommandInteraction, Client, ColorResolvable } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'role',
    name: 'edit',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply({ ephemeral: true });

        const role = interaction.options.getRole('role');
        const role_name = interaction.options.getString('name') ?? role.name;
        const role_hoist = interaction.options.getBoolean('hoist') ?? role.hoist;
        const role_mentionable = interaction.options.getBoolean('mentionable') ?? role.mentionable;

        await interaction.guild.roles.edit(role, {
            name: role_name,
            hoist: role_hoist,
            mentionable: role_mentionable,
            reason: `Role edited by ${interaction.user.tag}`
        }).then(async (d) => {
            await interaction.editReply({
                embeds: [
                    new Embed(role.color ?? colorolor)
                        .setDescription(`Updated the role ${d}.`)
                ]
            });
        }).catch(async (e) => {
            await interaction.editReply({
                embeds: [
                    new Embed(role.color ?? color)
                        .setDescription(`Failed to edit the role. Error message: ${e.message}.`)
                ]
            });
        });
    }
};
