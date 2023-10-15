import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'role',
  name: 'delete',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role');

    await interaction.guild.roles.delete(role.id, `Role deleted by ${interaction.user.username}`).catch(async e => {});

    await interaction.editReply({
      embeds: [new Embed(role.color ?? color).setDescription('Deleted the role.')],
    });
  },
};
