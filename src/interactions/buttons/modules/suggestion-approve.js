const {
  Client,
  ButtonInteraction,
  ColorResolvable,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
} = require('discord.js');
const { CustomEmbed } = require('@constants/customEmbed');
const { Embed } = require('@constants/embed');
const Suggest = require('@schemas/Suggestion');
const { getSuggestConfig } = require('@configs/suggestConfig');

module.exports = {
  name: 'suggestion-approve',
  /**
   * @param {Client} client
   * @param {ButtonInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: true });

    const id = parseInt(interaction.message.embeds[0].fields[2].value);
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
            .addFields({ name: 'Approved By', value: `${interaction.user}`, inline: true })
            .setFooter({ text: 'This suggestion was approved!' }),
        ],
      });

      await interaction.message.edit({
        embeds: [
          new Embed(Colors.Green)
            .setTitle('New Suggestion')
            .addFields(
              { name: 'User', value: `${interaction.message.embeds[0].fields[0].value}`, inline: true },
              { name: 'State', value: 'Approved', inline: true },
              { name: 'Approved By', value: `${interaction.user}`, inline: true },
              { name: 'ID', value: `${suggestion.id}`, inline: true },
              { name: 'Message', value: `${interaction.message.embeds[0].fields[3].value}`, inline: true },
              { name: 'Suggestion', value: `${suggestion.suggestion}`, inline: false },
            ),
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('suggestion-approve')
              .setLabel('Approve')
              .setDisabled(true)
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId('suggestion-deny')
              .setLabel('Deny')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setDisabled(true)
              .setCustomId('suggestion-delete')
              .setLabel('Delete')
              .setStyle(ButtonStyle.Secondary),
          ),
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
      user.send({ embeds: [embed], content: parseString(config.dmMessage.content) });
    });
  },
};
