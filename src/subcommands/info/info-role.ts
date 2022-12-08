import type { Role } from 'discord.js';
import { type CommandArgs, Subcommand, Embed } from '../../structures';

export default new Subcommand()
    .setParent('info')
    .setName('role')
    .setCallback(async ({ interaction, color }: CommandArgs) => {
        const role: Role = interaction.options.getRole('role', true) as Role;

        await interaction.editReply({
            embeds: [
                new Embed(role.color ?? color).setTitle('Role Info').setDescription(`
                **• Name:** ${role.name}
                **• Role:** ${role}
                **• ID:** ${role.id}
                **• Mentionable:** ${role.mentionable ? 'Yes' : 'No'}
                **• Separated:** ${role.hoist ? 'Yes' : 'No'}
                `),
            ],
        });
    });
