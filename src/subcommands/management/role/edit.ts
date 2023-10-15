import { ChatInputCommandInteraction, Client, ColorResolvable } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'role',
  name: 'edit',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const role = interaction.options.getRole('role');
    const role_name = interaction.options.getString('name') ?? role.name;
    const role_hoist = interaction.options.getBoolean('hoist') ?? role.hoist;
    const role_mentionable = interaction.options.getBoolean('mentionable') ?? role.mentionable;

    await interaction.guild.roles
      .edit(role, {
        name: role_name,
        hoist: role_hoist,
        mentionable: role_mentionable,
        reason: `Role edited by ${interaction.user.username}`,
      })
      .then(async d => {
        await interaction.editReply({
          embeds: [new Embed(role.color ?? color).setDescription(`Updated the role ${d}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [
            new Embed(role.color ?? color).setDescription(`Failed to edit the role. Error message: ${e.message}.`),
          ],
        });
      });
  },
};
