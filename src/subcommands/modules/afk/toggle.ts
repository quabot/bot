import { getAfkConfig } from '@configs/afkConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'afk',
  name: 'toggle',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    let enabled = interaction.options.getBoolean('enabled');

    const status = interaction.options.getString('status');

    const config = await getAfkConfig(interaction.guildId!, client);
    const user = await getUser(interaction.guildId!, interaction.user.id);
    if (!config || !user)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });
    if (enabled === null) enabled = !user.afk;

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The afk module is disabled in this server.')],
      });

    if (status) user.afkMessage = status;
    user.afk = enabled;
    await user.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`${enabled ? 'Enabled' : 'Disabled'} your afk status.`)],
    });
  },
};
