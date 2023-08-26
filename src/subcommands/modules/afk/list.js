const {
  ChatInputCommandInteraction,
  Client,
  ColorResolvable,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require('discord.js');
const { getAfkConfig } = require('@configs/afkConfig');
const { Embed } = require('@constants/embed');

module.exports = {
  parent: 'afk',
  name: 'list',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getAfkConfig(interaction.guildId, client);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            "We're still setting up some documents for first-time use! Please run the command again.",
          ),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The afk module is disabled in this server.')],
      });

    const User = require('@schemas/User');
    const found = await User.find({
      guildId: interaction.guildId,
      userId: interaction.user.id,
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

    const makeEmbed = async start => {
      const current = found.slice(start, start + 15);

      return new EmbedBuilder({
        title: `AFK users in ${interaction.guild.name} | ${start + 1}-${start + current.length}/${found.length}`,
        color: Colors.Green,
        description: `${await Promise.all(current.map(async item => `<@${item.userId}>\n`))}`,
      });
    };

    const canFit = found.length <= 5;
    const msg = await interaction.editReply({
      embeds: [await makeEmbed(0)],
      fetchReply: true,
      components: canFit ? [] : [new ActionRowBuilder({ components: [forwardButton] })],
    });
    if (canFit) return;

    const collector = msg.createMessageComponentCollector({ filter: ({ user }) => user.id === user.id });

    let currentIndex = 0;
    collector.on('collect', async i => {
      i.customId === backId ? (currentIndex -= 15) : (currentIndex += 15);
      await i.update({
        embeds: [await makeEmbed(currentIndex)],
        components: [
          new ActionRowBuilder({
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
