import { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } from 'discord.js';
import { getAfkConfig } from '@configs/afkConfig';
import { getUser } from '@configs/user';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'afk',
  name: 'status',

  async execute({ client, interaction, color }: CommandArgs) {
    const config = await getAfkConfig(interaction.guildId!, client);
    const user = await getUser(interaction.guildId!, interaction.user.id);
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

    const modal = new ModalBuilder().setCustomId('afk-set').setTitle('Set AFK status');

    const afkRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
      new TextInputBuilder()
        .setCustomId('afk-status')
        .setLabel('Enter your new AFK status')
        .setMinLength(1)
        .setMaxLength(200)
        .setPlaceholder("I'm sleeping...")
        .setRequired(true)
        .setStyle(TextInputStyle.Paragraph),
    );
    modal.addComponents(afkRow);

    await interaction.showModal(modal);
  },
};
