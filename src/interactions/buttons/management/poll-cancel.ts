import type { ButtonArgs } from '@typings/functionArgs';
import Poll from '@schemas/Poll';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
  name: 'cancel-poll',

  async execute({ interaction, client }: ButtonArgs) {
    const document = await Poll.findOne({
      guildId: interaction.guildId,
      interaction: interaction.message.id,
    });

    await interaction.update({
      components: [
        new ActionRowBuilder<ButtonBuilder>({
          components: [
            new ButtonBuilder({
              style: ButtonStyle.Primary,
              label: 'Enter Details',
              customId: 'details-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Secondary,
              label: 'Enter Choices',
              customId: 'choices-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Success,
              label: 'Create Poll',
              customId: 'create-poll',
              disabled: true,
            }),
            new ButtonBuilder({
              style: ButtonStyle.Danger,
              label: 'Cancel',
              customId: 'cancel-poll',
              disabled: true,
            }),
          ],
        }),
      ],
    });

    if (document) {
      await Poll.findOneAndDelete({
        guildId: interaction.guildId,
        interaction: interaction.message.id,
      });
    }

    client.cache.del(`polldata-${interaction.message.id}`);
  },
};
