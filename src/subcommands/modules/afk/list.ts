import { ButtonStyle, Colors, EmbedBuilder, ButtonBuilder, ActionRowBuilder } from 'discord.js';
import { getAfkConfig } from '@configs/afkConfig';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import User from '@schemas/User';

export default {
  parent: 'afk',
  name: 'list',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getAfkConfig(interaction.guildId!, client);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The afk module is disabled in this server.')],
      });

    const found = await User.find({
      guildId: interaction.guildId,
      afk: true,
    });

    const backId = 'back-afk';
    const forwardId = 'forward-afk';
    const backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Back',
      emoji: '⬅️',
      customId: backId,
    });
    const forwardButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Forward',
      emoji: '➡️',
      customId: forwardId,
    });

    const makeEmbed = async (start: number) => {
      const current = found.slice(start, start + 15);

      return new EmbedBuilder({
        title: `AFK users in ${interaction.guild?.name} | ${start + 1}-${start + current.length}/${found.length}`,
        color: Colors.Green,
        description: `${current.map(item => `<@${item.userId}>\n`)}`,
      });
    };

    const canFit = found.length <= 5;
    const msg = await interaction.editReply({
      embeds: [await makeEmbed(0)],
      components: canFit ? [] : [new ActionRowBuilder<ButtonBuilder>({ components: [forwardButton] })],
    });
    if (canFit) return;

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === user.id,
    });

    let currentIndex = 0;
    collector.on('collect', async i => {
      i.customId === backId ? (currentIndex -= 15) : (currentIndex += 15);
      await i.update({
        embeds: [await makeEmbed(currentIndex)],
        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              ...(currentIndex ? [backButton] : []),
              ...(currentIndex + 15 < found.length ? [forwardButton] : []),
            ],
          }),
        ],
      });
    });
  },
};
