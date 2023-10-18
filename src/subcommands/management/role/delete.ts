import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'role',
  name: 'delete',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role', true);

    await interaction.guild?.roles
      .delete(role.id, `Role deleted by ${interaction.user.username}`)
      .catch(async () => {});

    await interaction.editReply({
      embeds: [new Embed(role.color ?? color).setDescription('Deleted the role.')],
    });
  },
};
