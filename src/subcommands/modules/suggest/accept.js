const {
  Client,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} = require('discord.js');
const { getSuggestConfig } = require('@configs/suggestConfig');
const { Embed } = require('@constants/embed');
const Suggest = require('@schemas/Suggestion');
const { CustomEmbed } = require('@constants/customEmbed');

module.exports = {
  parent: 'suggestion',
  name: 'approve',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const config = await getSuggestConfig(client, interaction.guildId);
    if (!config)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('We just created a new document! Could you please run that command again?'),
        ],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestions are disabled in this server!')],
      });

    const id = interaction.options.getNumber('suggestion-id');
    const suggestion = await Suggest.findOne({
      guildId: interaction.guildId,
      id,
    });

    if (!suggestion)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestion.")],
      });

    if (suggestion.status === 'approved')
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The suggestion has already been approved.')],
      });

    const channel = interaction.guild.channels.cache.get(config.channelId);
    if (!channel)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the suggestions channel.")],
      });

    await channel.messages.fetch(suggestion.msgId).then(async message => {
      if (!message)
        return interaction.editReply({
          embeds: [new Embed(color).setDescription("Couldn't find the suggestion! Are you sure it wasn't deleted?")],
        });

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Suggestion approved.')],
      });

      suggestion.status = 'approved';
      await suggestion.save();

      message.edit({
        embeds: [
          EmbedBuilder.from(message.embeds[0])
            .setColor(Colors.Green)
            .addFields({
              name: 'Approved By',
              value: `${interaction.user}`,
              inline: true,
            })
            .setFooter({ text: 'This suggestion was approved!' }),
        ],
      });

      if (!config.dm) return;

      const user = interaction.guild?.members.cache.get(`${suggestion.userId}`);
      const parseString = text =>
        text
          .replaceAll('{suggestion}', suggestion.suggestion)
          .replaceAll('{user}', `${user}`)
          .replaceAll('{avatar}', user.displayAvatarURL() ?? '')
          .replaceAll('{server}', interaction.guild?.name ?? '')
          .replaceAll('{staff}', `${interaction.user ?? ''}`)
          .replaceAll('{state}', 'approved')
          .replaceAll('{color}', color)
          .replaceAll('{icon}', interaction.guild?.iconURL() ?? '');

      const embed = new CustomEmbed(config.dmMessage, parseString);
      user.send({
        embeds: [embed],
        content: parseString(config.dmMessage.content),
      });
    });
  },
};
