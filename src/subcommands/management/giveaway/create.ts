import { ChannelType, type GuildTextBasedChannel } from 'discord.js';
import { getGiveawayConfig } from '@configs/giveawayConfig';
import { getIdConfig } from '@configs/idConfig';
import { Embed } from '@constants/embed';
import ms from 'ms';
import { rollGiveaway } from '@functions/giveaway';
import Giveaway from '@schemas/Giveaway';
import type { CommandArgs } from '@typings/functionArgs';
import type { NonNullMongooseReturn } from '@typings/mongoose';
import type { IIds } from '@typings/schemas';
import { GuildTextBasedChannel as GuildTextBasedChannelEnum } from '@typings/discord';

export default {
  parent: 'giveaway',
  name: 'create',

  async execute({ client, interaction, color }: CommandArgs) {
    await interaction.deferReply({ ephemeral: true });

    const rawIds = await getIdConfig(interaction.guildId!);
    const config = await getGiveawayConfig(interaction.guildId!, client);

    if (!rawIds || !config)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('There was an error. Please try again.')],
      });

    if (!config.enabled)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Giveaways are disabled in this server.')],
      });

    const channel = interaction.options.getChannel('channel', true, GuildTextBasedChannelEnum) as GuildTextBasedChannel;
    const prize = interaction.options.getString('prize');
    const winners = interaction.options.getNumber('winners');
    const duration = interaction.options.getString('duration');

    if (!channel || !prize || !winners || !duration)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter all the required fields.')],
      });

    if (channel.type !== ChannelType.GuildAnnouncement && channel.type !== ChannelType.GuildText)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription('Please create the giveaway in either a text or announcement channel.'),
        ],
      });

    if (!ms(duration))
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a valid duration. Eg. 1h, 5m, 1d etc.')],
      });

    if (ms(duration) > 2147483647)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a value that is below 24 days.')],
      });

    if (winners > 25 || winners < 1)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('The amount of winners needs to be between 1 and 25.')],
      });

    if (prize.length > 500)
      return await interaction.editReply({
        embeds: [new Embed(color).setDescription('Please enter a prize with a maximum length of 500.')],
      });

    const endTime = Math.round((new Date().getTime() + ms(duration)) / 1000);

    if (!rawIds.giveawayId && rawIds.giveawayId !== 0) rawIds.giveawayId = -1;

    const ids = rawIds as Omit<NonNullMongooseReturn<IIds>, 'giveawayId'> & { giveawayId: number };

    const message = await channel.send({
      embeds: [
        new Embed(color)
          .setTitle(`${prize}`)
          .setDescription(
            `React with :tada: to participate!
                    Ends: <t:${endTime}:R>
                    Winners: **${winners}**
                    Hosted by: ${interaction.user}
                    `,
          )
          .setFooter({ text: `ID: ${ids.giveawayId}` }),
      ],
      content: `${config.pingEveryone ? '@everyone\n**:tada: GIVEAWAY :tada:**' : '**:tada: GIVEAWAY :tada:**'}`,
    });

    if (!message)
      return await interaction.editReply({
        embeds: [
          new Embed(color).setDescription(
            'Failed to send the message. Please make sure I have the permissions required to post there.',
          ),
        ],
      });
    message.react('🎉');

    const newGiveaway = new Giveaway({
      guildId: interaction.guildId,
      id: ids.giveawayId,

      prize,
      winners,

      channel: channel.id,
      message: message.id,
      host: interaction.user.id,

      endTimestamp: new Date().getTime() + ms(duration),
      ended: false,
    });
    await newGiveaway.save();

    ids.giveawayId++;
    await ids.save();

    await interaction.editReply({
      embeds: [
        new Embed(color).setDescription(
          `The giveaway has been created and is starting in ${channel}! [Click here](${message.url}) to jump there.`,
        ),
      ],
    });

    setTimeout(async () => {
      await rollGiveaway(client, newGiveaway, true);
    }, ms(duration));
  },
};
