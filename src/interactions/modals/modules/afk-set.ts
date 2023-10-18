import { Embed } from '@constants/embed';
import { getAfkConfig } from '@configs/afkConfig';
import { getUser } from '@configs/user';
import type { ModalArgs } from '@typings/functionArgs';

export default {
  name: 'afk-set',

  async execute({ client, interaction, color }: ModalArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getAfkConfig(interaction.guildId!, client);
    const user = await getUser(interaction.guildId!, interaction.user.id, client);
    if (!config || !user)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
        ephemeral: true,
      });

    if (!config.enabled)
      return await interaction.reply({
        embeds: [new Embed(color).setDescription('The afk module is disabled in this server.')],
        ephemeral: true,
      });

    const status = interaction.fields.getTextInputValue('afk-status');
    user.afkMessage = status;
    await user.save();

    await interaction.editReply({
      embeds: [new Embed(color).setDescription(`Set your AFK status message to: \`${status}\``)],
    });
  },
};
