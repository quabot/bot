import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'info',
  name: 'role',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const role = interaction.options.getRole('role', true);

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
