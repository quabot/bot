import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import type { Role } from 'discord.js';

export default {
  parent: 'info',
  name: 'role',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const rawRole = interaction.options.getRole('role', true);
    if ('unicode_emoji' in rawRole)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            `Sorry, Discord didn't give the role to us in the right way. Please try again.`,
          ),
        ],
      });

    const role = rawRole as Role;

    await interaction.editReply({
      embeds: [
        new Embed(role.color ?? color).setTitle('Role Info').setDescription(`
                - **Name:** ${role.name}\n- **Role:** ${role}\n- **ID:** ${role.id}\n- **Users:** ${
                  role.members.size
                }\n- **Mentionable:** ${role.mentionable ? 'Yes' : 'No'}\n- **Separated:** ${role.hoist ? 'Yes' : 'No'}
                    `),
      ],
    });
  },
};
