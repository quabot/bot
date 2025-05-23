import { ButtonBuilder, ButtonStyle, EmbedBuilder, Colors, ActionRowBuilder } from 'discord.js';
import { Embed } from '@constants/embed';
import type { CommandArgs } from '@typings/functionArgs';
import Punishment from '@schemas/Punishment';

export default {
  parent: 'punishments',
  name: 'view',

  async execute({ interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const user = interaction.options.getUser('user');
    const staff = interaction.options.getUser('staff-member');
    const type = interaction.options.getString('type');
    const id = interaction.options.getString('id');
    const userId = interaction.options.getString('user-id');

    const punishments = await Punishment.find({ guildId: interaction.guildId });

    let filtered = punishments;
    if (user) filtered = filtered.filter(punishment => punishment.userId === user.id);
    if (staff) filtered = filtered.filter(punishment => punishment.moderatorId === staff.id);
    if (type) filtered = filtered.filter(punishment => punishment.type === type);
    if (id) filtered = filtered.filter(punishment => punishment.id === id);
    if (userId) filtered = filtered.filter(punishment => punishment.userId === userId);

    if (filtered.length === 0)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('No punishments with those filters found.')],
      });

    const backId = 'back-punishments';
    const forwardId = 'forward-punishments';
    const backButton = new ButtonBuilder({
      style: ButtonStyle.Secondary,
      label: 'Backward',
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
      const current = filtered.slice(start, start + 3);

      return new EmbedBuilder({
        title: `Punishments ${start + 1}-${start + current.length}/${filtered.length}`,
        color: Colors.Red,
        fields: await Promise.all(
          current.map(async item => ({
            name: `Type: ${item.type} | ID: \`${item.id}\``,
            value: `Staff: <@${item.moderatorId}> | User: <@${item.userId}> - Reason: ${item.reason}`,
          })),
        ),
      });
    };

    const canFit = filtered.length <= 3;
    const msg = await interaction.editReply({
      embeds: [await makeEmbed(0)],
      components: canFit ? [] : [new ActionRowBuilder<ButtonBuilder>({ components: [forwardButton] })],
    });
    if (canFit) return;

    const collector = msg.createMessageComponentCollector({
      filter: ({ user }) => user.id === interaction.user.id,
    });

    let currentIndex = 0;
    collector.on('collect', async i => {
      i.customId === backId ? (currentIndex -= 3) : (currentIndex += 3);
      await i.update({
        embeds: [await makeEmbed(currentIndex)],
        components: [
          new ActionRowBuilder<ButtonBuilder>({
            components: [
              ...(currentIndex ? [backButton] : []),
              ...(currentIndex + 3 < filtered.length ? [forwardButton] : []),
            ],
          }),
        ],
      });
    });
  },
};
