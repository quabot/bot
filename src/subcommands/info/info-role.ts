import type { ChatInputCommandInteraction, Client, ColorResolvable, Role } from 'discord.js';
import { embed } from '../../utils/constants/embeds';

module.exports = {
    parent: 'info',
    name: 'role',
    async execute(_client: Client, interaction: ChatInputCommandInteraction, color: ColorResolvable) {
        await interaction.deferReply();

        const role: Role = interaction.options.getRole('role', true) as Role;

        await interaction.editReply({
            embeds: [
                embed(role.color ?? color).setTitle('Role Info').setDescription(`
                    **• Name:** ${role.name}
                    **• Role:** ${role}
                    **• ID:** ${role.id}
                    **• Mentionable:** ${role.mentionable ? 'Yes' : 'No'}
                    **• Separated:** ${role.hoist ? 'Yes' : 'No'}
                    `),
            ],
        });
    },
};
