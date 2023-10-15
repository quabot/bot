const {
  Client,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChatInputCommandInteraction,
  AttachmentBuilder,
} = require('discord.js');
const { getSuggestConfig } = require('@configs/suggestConfig');
import { Embed } from '@constants/embed';
const { getLevelConfig } = require('@configs/levelConfig');
const { getLevel } = require('@configs/level');
const { drawCard } = require('@functions/levelCard');
import type { CommandArgs } from '@typings/functionArgs';

export default {
  parent: 'level',
  name: 'view',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply();

    const config = await getLevelConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use, please try again.",
          ),
        ],
      });
    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Levels are disabled in this server.')],
      });

    const user = interaction.options.getUser('user') ?? interaction.user;
    const levelDB = await getLevel(interaction.guildId, user.id);
    if (!levelDB)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use, please try again.",
          ),
        ],
      });

    const formula = lvl => 120 * lvl ** 2 + 100;

    if (!config.viewCard) {
      await interaction.editReply({
        embeds: [
          new Embed(color)
            .setThumbnail(user.displayAvatarURL({ forceStatic: false }))
            .setTitle(`${user.displayName}'s level status`)
            .setDescription(
              `${user} is level **${levelDB.level}** and has **${levelDB.xp}/${formula(levelDB.level)}** xp.`,
            ),
        ],
      });
    } else {
      const card = await drawCard(
        interaction.member,
        interaction.user,
        levelDB.level,
        levelDB.xp,
        formula(levelDB.level),
        config.levelCard,
      );
      if (!card) return interaction.editReply('Internal error with level card');

      const attachment = new AttachmentBuilder(card, {
        name: 'level_card.png',
      });

      await interaction.editReply({ files: [attachment] });
    }
  },
};
