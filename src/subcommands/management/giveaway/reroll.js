const { ChatInputCommandInteraction, Client, ColorResolvable, ChannelType } = require('discord.js');
const { getGiveawayConfig } = require('@configs/giveawayConfig');
const { Embed } = require('@constants/embed');
const Giveaway = require('@schemas/Giveaway');
const { endGiveaway } = require('../../../utils/functions/giveaway');
const { shuffleArray } = require('../../../utils/functions/array');

module.exports = {
  parent: 'giveaway',
  name: 'reroll',
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   * @param {ColorResolvable} color
   */
  async execute(client, interaction, color) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getGiveawayConfig(client, interaction.guildId);

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
        embeds: [new Embed(color).setDescription('Giveaways are disabled in this server.')],
      });

    const id = interaction.options.getNumber('giveaway-id');
    if (id === null || id === undefined)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid id to end.')],
      });

    const giveaway = await Giveaway.findOne({
      guildId: interaction.guildId,
      id,
    });
    if (!giveaway)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription("Couldn't find the giveaway!")],
      });

    const channel = interaction.guild.channels.cache.get(giveaway.channel);
    if (!channel) return;

    channel.messages.fetch(`${giveaway.message}`).then(async message => {
      const reactions = await message.reactions.cache.get('🎉').users.fetch();
      const shuffled = await shuffleArray(
        // eslint-disable-next-line no-undef
        (array = Array.from(
          reactions.filter(u => u.id !== client.user.id),
          ([name, value]) => ({ name, value }),
        )),
      );

      const winners = shuffled.slice(0, giveaway.winners);
      const isWinner = winners.length !== 0;
      let winMsg = winners.map(u => `<@${u.value.id}>`).join(', ');
      if (!isWinner) winMsg = 'Not enough entries!';

      await message.edit({
        embeds: [
          new Embed(color)
            .setTitle(`${giveaway.prize}`)
            .setDescription(
              `Ended: <t:${Math.floor(giveaway.endTimestamp / 1000)}:R>
                            Winners: **${winMsg}**
                            Hosted by: <@${giveaway.host}>`,
            )
            .setFooter({ text: `ID: ${giveaway.id}` }),
        ],
      });

      if (isWinner)
        await message.reply({
          embeds: [new Embed(color).setDescription(`${winMsg}, you won **${giveaway.prize}**!`)],
          content: `${winMsg}`,
        });

      if (!isWinner)
        await message.reply({
          embeds: [new Embed(color).setDescription('There were not enough entries for a winner to be determined.')],
        });

      giveaway.ended = true;
      await giveaway.save();

      await interaction.editReply({
        embeds: [new Embed(color).setDescription('Rerolling giveaway!')],
      });
    });
  },
};
