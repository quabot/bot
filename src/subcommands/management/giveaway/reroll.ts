import { getGiveawayConfig } from '@configs/giveawayConfig';
import { Embed } from '@constants/embed';
import Giveaway from '@schemas/Giveaway';
import { shuffleArray } from '@functions/array';
import type { CommandArgs } from '@typings/functionArgs';
import { ChannelType } from 'discord.js';

export default {
  parent: 'giveaway',
  name: 'reroll',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: false });

    const config = await getGiveawayConfig(interaction.guildId!, client);

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

    const channel = interaction.guild?.channels.cache.get(giveaway.channel);
    if (!channel || channel.type === ChannelType.GuildCategory) return;

    channel.messages.fetch(`${giveaway.message}`).then(async message => {
      const reactions = await message.reactions.cache.get('🎉')?.users.fetch();
      const shuffled = shuffleArray(
        Array.from(reactions?.filter(u => u.id !== client.user?.id) ?? [], ([name, value]) => ({ name, value })),
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
              `Ended: <t:${Math.floor(parseFloat(giveaway.endTimestamp) / 1000)}:R>
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
