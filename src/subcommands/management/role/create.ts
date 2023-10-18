import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import type { RoleCreateOptions } from 'discord.js';

export default {
  parent: 'role',
  name: 'create',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const role_name = interaction.options.getString('name');
    const role_hoist = interaction.options.getBoolean('hoist') ?? false;
    const role_mentionable = interaction.options.getBoolean('mentionable') ?? false;

    const roleCreateOptions: RoleCreateOptions = {
      hoist: role_hoist,
      mentionable: role_mentionable,
      reason: `Role created by ${interaction.user.username}`,
    };

    if (role_name) roleCreateOptions.name = role_name;

    await interaction.guild?.roles
      .create(roleCreateOptions)
      .then(async d => {
        await interaction.editReply({
          embeds: [new Embed(d.color ?? color).setDescription(`Created the role ${d}.`)],
        });
      })
      .catch(async e => {
        await interaction.editReply({
          embeds: [new Embed(color).setDescription(`Failed to create the role. Error message: ${e.message}.`)],
        });
      });
  },
};
