import { Embed } from '@constants/embed';
import PunishmentAppeal from '@schemas/PunishmentAppeal';
import { getModerationConfig } from '@configs/moderationConfig';
import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { ButtonArgs } from '@typings/functionArgs';


const appealButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setCustomId('previous-appeal').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
  new ButtonBuilder().setCustomId('next-appeal').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
);
const appealComponents = [
  new ButtonBuilder().setCustomId('previous-disabled').setStyle(ButtonStyle.Secondary).setEmoji('◀️'),
  new ButtonBuilder().setCustomId('next-disabled').setStyle(ButtonStyle.Secondary).setEmoji('▶️'),
];

export default {
  name: 'appeal-view',
  async execute({ interaction, color, client }: ButtonArgs) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.message.embeds[0].footer?.text;
    if (!id)
      return await interaction.reply({
        embeds: [
          new Embed(color).setDescription('An internal error occurred: no punishment ID in embed footer found.'),
        ],
        ephemeral: true,
      });

    const config = await getModerationConfig(client, interaction.guildId!);
    if (!config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no moderation config found.')],
      });

    const appeal = await PunishmentAppeal.findOne({
      punishmentId: id,
      guildId: interaction.guildId,
    });
    if (!appeal)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('An internal error occurred: no appeal found for the ID.')],
      });

    const buildEmbed = (i: number) => {
      return new Embed(color)
        .setTitle(`Question ${i + 1}/${config.appealQuestions.length}`)
        .setDescription(`**${config.appealQuestions![i]}**\n${appeal.answers[i] ?? "No answer given."}`);
    };

    let page = 0;

    const currentPage = await interaction.editReply({
      embeds: [
        buildEmbed(page).setFooter({
          text: `Page ${page + 1} / ${config.appealQuestions.length}`,
        }),
      ],
      components: [appealButtons],
    });

    //* Create the collector and update the pages accordingly.
    const collector = currentPage.createMessageComponentCollector({
      filter: i => i.customId === 'previous-appeal' || i.customId === 'next-appeal',
      time: 40000,
    });

    collector.on('collect', async i => {
      switch (i.customId) {
        case 'previous-appeal':
          page = page > 0 ? --page : config.appealQuestions.length - 1;
          break;
        case 'next-appeal':
          page = page + 1 < config.appealQuestions.length ? ++page : 0;
          break;
      }
      await i.deferUpdate();
      await i.editReply({
        embeds: [
          buildEmbed(page).setFooter({
            text: `Page ${page + 1} / ${config.appealQuestions.length}`,
          }),
        ],
        components: [appealButtons],
      });
      collector.resetTimer();
    });

    //* Disable the buttons when the collector ends.
    collector.on('end', async (_, reason) => {
      if (reason !== 'messageDelete') {
        const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          appealComponents[0].setDisabled(true),
          appealComponents[1].setDisabled(true),
        );
        await currentPage
          .edit({
            embeds: [
              buildEmbed(page).setFooter({
                text: `Page ${page + 1} / ${config.appealQuestions.length}`,
              }),
            ],
            components: [disabledRow],
          })
          .catch(() => {});
      }
    });
  },
};
