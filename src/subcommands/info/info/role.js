const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { Embed } = require('../../../utils/constants/embed');

module.exports = {
    parent: 'info',
    name: 'role',
    /**
     * @param {Client} client 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {ColorResolvable} color 
     */
    async execute(client, interaction, color) {
        await interaction.deferReply();

        const role = interaction.options.getRole('role', true);

        await interaction.editReply({
            embeds: [
                new Embed(role.color ?? color).setTitle('Role Info').setDescription(`
                - **Name:** ${role.name}\n- **Role:** ${role}\n- **ID:** ${role.id}\n- **Users:** ${role.members.size}\n- **Mentionable:** ${role.mentionable ? 'Yes' : 'No'}\n- **Separated:** ${role.hoist ? 'Yes' : 'No'}
                    `),
            ],
        });
    },
};
